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

export const sourcesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['source'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a source by ID',
				action: 'Get a source',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many sources',
				action: 'Get many sources',
			},
		],
		default: 'getMany',
	},
];

export const sourcesFields: INodeProperties[] = [
	// ----------------------------------
	//         source: get
	// ----------------------------------
	{
		displayName: 'Source ID',
		name: 'sourceId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['source'],
				operation: ['get'],
			},
		},
		description: 'The ID of the source',
	},

	// ----------------------------------
	//         source: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['source'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	...paginationFields.map((field) => ({
		...field,
		displayOptions: {
			show: {
				resource: ['source'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	})),
];

export async function executeSourcesOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			responseData = await greenhouseApiRequestAllItems.call(
				this,
				'GET',
				'/sources',
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				'/sources',
				{},
				{ per_page: limit },
			);
		}
	} else if (operation === 'get') {
		const sourceId = this.getNodeParameter('sourceId', index) as number;
		responseData = await greenhouseApiRequest.call(
			this,
			'GET',
			`/sources/${sourceId}`,
		);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
		{ itemData: { item: index } },
	);

	return executionData;
}
