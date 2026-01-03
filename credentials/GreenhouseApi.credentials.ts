/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GreenhouseApi implements ICredentialType {
	name = 'greenhouseApi';
	displayName = 'Greenhouse API';
	documentationUrl = 'https://developers.greenhouse.io/harvest.html';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The Greenhouse Harvest API key. Found in Configure > Dev Center > API Credential Management.',
		},
		{
			displayName: 'On-Behalf-Of User ID',
			name: 'onBehalfOf',
			type: 'string',
			default: '',
			description: 'The Greenhouse User ID for audit trail on write operations. Required for POST/PUT/PATCH/DELETE requests.',
		},
		{
			displayName: 'Board Token',
			name: 'boardToken',
			type: 'string',
			default: '',
			description: 'Optional. The public job board token for Job Board API access. Found in your public job board URL.',
		},
		{
			displayName: 'Base URL - Harvest API',
			name: 'harvestBaseUrl',
			type: 'string',
			default: 'https://harvest.greenhouse.io/v1',
			description: 'The base URL for the Greenhouse Harvest API',
		},
		{
			displayName: 'Base URL - Job Board API',
			name: 'jobBoardBaseUrl',
			type: 'string',
			default: 'https://boards-api.greenhouse.io/v1',
			description: 'The base URL for the Greenhouse Job Board API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.apiKey}}',
				password: '',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.harvestBaseUrl}}',
			url: '/users',
			method: 'GET',
			qs: {
				per_page: 1,
			},
		},
	};
}
