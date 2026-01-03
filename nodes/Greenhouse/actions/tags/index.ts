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

export const tagsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tag'],
			},
		},
		options: [
			{
				name: 'Add to Candidate',
				value: 'addToCandidate',
				description: 'Add a tag to a candidate',
				action: 'Add a tag to a candidate',
			},
			{
				name: 'Get Application Tags',
				value: 'getApplicationTags',
				description: 'Get all application tags',
				action: 'Get application tags',
			},
			{
				name: 'Get Candidate Tags',
				value: 'getCandidateTags',
				description: 'Get all candidate tags',
				action: 'Get candidate tags',
			},
			{
				name: 'Remove From Candidate',
				value: 'removeFromCandidate',
				description: 'Remove a tag from a candidate',
				action: 'Remove a tag from a candidate',
			},
		],
		default: 'getCandidateTags',
	},
];

export const tagsFields: INodeProperties[] = [
	// ----------------------------------
	//         tag: getCandidateTags / getApplicationTags
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['getCandidateTags', 'getApplicationTags'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	...paginationFields.map((field) => ({
		...field,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['getCandidateTags', 'getApplicationTags'],
				returnAll: [false],
			},
		},
	})),

	// ----------------------------------
	//         tag: addToCandidate / removeFromCandidate
	// ----------------------------------
	{
		displayName: 'Candidate ID',
		name: 'candidateId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['addToCandidate', 'removeFromCandidate'],
			},
		},
		description: 'The ID of the candidate',
	},
	{
		displayName: 'Tag Name',
		name: 'tagName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['addToCandidate', 'removeFromCandidate'],
			},
		},
		description: 'The name of the tag to add or remove',
	},
];

export async function executeTagsOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	if (operation === 'getCandidateTags') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			responseData = await greenhouseApiRequestAllItems.call(
				this,
				'GET',
				'/tags/candidate',
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				'/tags/candidate',
				{},
				{ per_page: limit },
			);
		}
	} else if (operation === 'getApplicationTags') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			responseData = await greenhouseApiRequestAllItems.call(
				this,
				'GET',
				'/tags/application',
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				'/tags/application',
				{},
				{ per_page: limit },
			);
		}
	} else if (operation === 'addToCandidate') {
		const candidateId = this.getNodeParameter('candidateId', index) as number;
		const tagName = this.getNodeParameter('tagName', index) as string;

		responseData = await greenhouseApiRequest.call(
			this,
			'PUT',
			`/candidates/${candidateId}/tags/${encodeURIComponent(tagName)}`,
		);
	} else if (operation === 'removeFromCandidate') {
		const candidateId = this.getNodeParameter('candidateId', index) as number;
		const tagName = this.getNodeParameter('tagName', index) as string;

		responseData = await greenhouseApiRequest.call(
			this,
			'DELETE',
			`/candidates/${candidateId}/tags/${encodeURIComponent(tagName)}`,
		);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
		{ itemData: { item: index } },
	);

	return executionData;
}
