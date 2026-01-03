/**
 * n8n-nodes-greenhouse
 * Copyright (c) 2025 Velocity BPA
 *
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://github.com/Velocity-BPA/n8n-nodes-greenhouse/blob/main/LICENSE
 *
 * Change Date: 2029-01-03
 *
 * On the Change Date, this software will be made available under the
 * Apache License, Version 2.0.
 *
 * For commercial licensing, contact licensing@velobpa.com
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { greenhouseApiRequest, greenhouseApiRequestAllItems } from '../../transport';
import { paginationFields } from '../../utils';

export const eeocOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['eeoc'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get EEOC data for an application',
				action: 'Get EEOC data',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get EEOC data for many applications',
				action: 'Get many EEOC records',
			},
		],
		default: 'getMany',
	},
];

export const eeocFields: INodeProperties[] = [
	// ----------------------------------
	//         eeoc: get
	// ----------------------------------
	{
		displayName: 'Application ID',
		name: 'applicationId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['eeoc'],
				operation: ['get'],
			},
		},
		description: 'The ID of the application to get EEOC data for',
	},

	// ----------------------------------
	//         eeoc: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['eeoc'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	...paginationFields.map((field) => ({
		...field,
		displayOptions: {
			show: {
				resource: ['eeoc'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	})),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['eeoc'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Submitted After',
				name: 'submitted_after',
				type: 'dateTime',
				default: '',
				description: 'Return EEOC data submitted after this date',
			},
			{
				displayName: 'Submitted Before',
				name: 'submitted_before',
				type: 'dateTime',
				default: '',
				description: 'Return EEOC data submitted before this date',
			},
		],
	},
];

export async function executeEeocOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const options = this.getNodeParameter('options', index, {}) as {
			submitted_after?: string;
			submitted_before?: string;
		};

		const qs: Record<string, string | number> = {};
		if (options.submitted_after) qs.submitted_after = options.submitted_after;
		if (options.submitted_before) qs.submitted_before = options.submitted_before;

		if (returnAll) {
			responseData = await greenhouseApiRequestAllItems.call(
				this,
				'GET',
				'/eeoc',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.per_page = limit;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				'/eeoc',
				{},
				qs,
			);
		}
	} else if (operation === 'get') {
		const applicationId = this.getNodeParameter('applicationId', index) as number;
		responseData = await greenhouseApiRequest.call(
			this,
			'GET',
			`/applications/${applicationId}/eeoc`,
		);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
		{ itemData: { item: index } },
	);

	return executionData;
}
