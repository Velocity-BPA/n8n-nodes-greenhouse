/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';

import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export interface IGreenhouseCredentials {
	apiKey: string;
	onBehalfOf?: string;
	boardToken?: string;
	harvestBaseUrl: string;
	jobBoardBaseUrl: string;
}

export interface IPaginationOptions {
	perPage?: number;
	page?: number;
	returnAll?: boolean;
	limit?: number;
}

export interface IApiResponse {
	data: IDataObject | IDataObject[];
	headers?: IDataObject;
	nextPage?: string;
}

/**
 * Makes an authenticated request to the Greenhouse Harvest API
 */
export async function greenhouseApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	uri?: string,
	headers: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('greenhouseApi') as IGreenhouseCredentials;

	const options: IHttpRequestOptions = {
		method,
		url: uri ?? `${credentials.harvestBaseUrl}${endpoint}`,
		qs,
		body,
		json: true,
		returnFullResponse: false,
		headers: {
			...headers,
		},
	};

	// Add On-Behalf-Of header for write operations
	if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && credentials.onBehalfOf) {
		options.headers = {
			...options.headers,
			'On-Behalf-Of': credentials.onBehalfOf,
		};
	}

	// Remove empty body for GET/DELETE requests
	if (['GET', 'DELETE'].includes(method)) {
		delete options.body;
	}

	// Remove empty objects
	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}
	if (options.body && Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'greenhouseApi',
			options,
		);
		return response as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: getErrorMessage(error),
		});
	}
}

/**
 * Makes a request with full response to access headers for pagination
 */
export async function greenhouseApiRequestWithHeaders(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IApiResponse> {
	const credentials = await this.getCredentials('greenhouseApi') as IGreenhouseCredentials;

	const options: IHttpRequestOptions = {
		method,
		url: `${credentials.harvestBaseUrl}${endpoint}`,
		qs,
		body,
		json: true,
		returnFullResponse: true,
		headers: {},
	};

	if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && credentials.onBehalfOf) {
		options.headers = {
			...options.headers,
			'On-Behalf-Of': credentials.onBehalfOf,
		};
	}

	if (['GET', 'DELETE'].includes(method)) {
		delete options.body;
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}
	if (options.body && Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'greenhouseApi',
			options,
		) as { body: IDataObject | IDataObject[]; headers: IDataObject };

		return {
			data: response.body,
			headers: response.headers,
			nextPage: parseLinkHeader(response.headers?.link as string),
		};
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: getErrorMessage(error),
		});
	}
}

/**
 * Makes a request to the Greenhouse Job Board API
 */
export async function greenhouseJobBoardApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	boardToken?: string,
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('greenhouseApi') as IGreenhouseCredentials;
	const token = boardToken || credentials.boardToken;

	if (!token) {
		throw new NodeApiError(this.getNode(), {
			message: 'Board Token is required for Job Board API operations',
		} as JsonObject);
	}

	const options: IHttpRequestOptions = {
		method,
		url: `${credentials.jobBoardBaseUrl}/boards/${token}${endpoint}`,
		qs,
		body,
		json: true,
	};

	if (['GET', 'DELETE'].includes(method)) {
		delete options.body;
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}
	if (options.body && Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}

	try {
		// Job Board API is public, no authentication needed for read operations
		if (method === 'GET') {
			const response = await this.helpers.request(options);
			return typeof response === 'string' ? JSON.parse(response) : response;
		}

		// Write operations need authentication
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'greenhouseApi',
			options,
		);
		return response as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: getErrorMessage(error),
		});
	}
}

/**
 * Handles pagination for Greenhouse API using cursor-based pagination
 */
export async function greenhouseApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	options: IPaginationOptions = {},
): Promise<IDataObject[]> {
	const returnAll = options.returnAll ?? true;
	const limit = options.limit ?? 100;
	const perPage = options.perPage ?? 100;

	const allItems: IDataObject[] = [];
	let nextPage: string | undefined;

	qs.per_page = perPage;

	do {
		const response = await greenhouseApiRequestWithHeaders.call(
			this,
			method,
			endpoint,
			body,
			qs,
		);

		const items = Array.isArray(response.data) ? response.data : [response.data];
		allItems.push(...items);

		if (!returnAll && allItems.length >= limit) {
			return allItems.slice(0, limit);
		}

		nextPage = response.nextPage;
		if (nextPage) {
			// For subsequent requests, use the full URL from Link header
			const nextResponse = await greenhouseApiRequestWithHeaders.call(
				this,
				method,
				'',
				body,
				{},
			);
			const nextItems = Array.isArray(nextResponse.data) ? nextResponse.data : [nextResponse.data];
			allItems.push(...nextItems);
			nextPage = nextResponse.nextPage;
		}
	} while (nextPage && (returnAll || allItems.length < limit));

	return returnAll ? allItems : allItems.slice(0, limit);
}

/**
 * Parses the Link header to extract the next page URL
 * Greenhouse uses RFC 5988 Link headers for pagination
 */
function parseLinkHeader(linkHeader: string | undefined): string | undefined {
	if (!linkHeader) return undefined;

	const links = linkHeader.split(',');
	for (const link of links) {
		const [urlPart, relPart] = link.split(';');
		if (relPart?.includes('rel="next"')) {
			return urlPart.trim().replace(/<(.*)>/, '$1');
		}
	}
	return undefined;
}

/**
 * Extracts a user-friendly error message from API errors
 */
function getErrorMessage(error: unknown): string {
	const err = error as IDataObject;

	if (err.response) {
		const response = err.response as IDataObject;
		if (response.body) {
			const body = response.body as IDataObject;
			if (body.message) return body.message as string;
			if (body.errors) {
				const errors = body.errors as IDataObject[];
				return errors.map((e) => e.message || JSON.stringify(e)).join(', ');
			}
		}
	}

	if (err.message) return err.message as string;

	return 'An unknown error occurred';
}

/**
 * Validates webhook signature from Greenhouse
 */
export function validateWebhookSignature(
	payload: string,
	signature: string,
	secretKey: string,
): boolean {
	const hmac = crypto.createHmac('sha256', secretKey);
	const expectedSignature = hmac.update(payload).digest('hex');
	return crypto.timingSafeEqual(
		Buffer.from(signature),
		Buffer.from(expectedSignature),
	);
}
