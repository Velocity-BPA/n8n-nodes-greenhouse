/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { greenhouseApiRequest, greenhouseApiRequestAllItems } from '../../transport';
import { cleanObject, paginationFields } from '../../utils';

export const jobPostFields: INodeProperties[] = [
	// Get Many
	{
		displayName: 'Live Only',
		name: 'liveOnly',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['jobPost'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to only return live job posts',
	},
	...paginationFields.map((field) => ({
		...field,
		displayOptions: {
			show: {
				resource: ['jobPost'],
				operation: ['getMany'],
			},
		},
	})),

	// Job Post ID
	{
		displayName: 'Job Post ID',
		name: 'jobPostId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['jobPost'],
				operation: ['get', 'update', 'getQuestions'],
			},
		},
		description: 'The ID of the job post',
	},

	// Update
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['jobPost'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 6,
				},
				default: '',
				description: 'The HTML content of the job post',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Live', value: 'live' },
					{ name: 'Offline', value: 'offline' },
				],
				default: 'live',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
		],
	},
];

export async function executeJobPostOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const limit = this.getNodeParameter('limit', i, 50) as number;
			const liveOnly = this.getNodeParameter('liveOnly', i) as boolean;

			const qs: IDataObject = {
				live: liveOnly,
			};

			if (returnAll) {
				responseData = await greenhouseApiRequestAllItems.call(
					this,
					'GET',
					'/job_posts',
					{},
					qs,
				);
			} else {
				qs.per_page = limit;
				responseData = await greenhouseApiRequest.call(
					this,
					'GET',
					'/job_posts',
					{},
					qs,
				);
			}
			break;
		}

		case 'get': {
			const jobPostId = this.getNodeParameter('jobPostId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/job_posts/${jobPostId}`,
			);
			break;
		}

		case 'update': {
			const jobPostId = this.getNodeParameter('jobPostId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.title) body.title = updateFields.title;
			if (updateFields.location) body.location = updateFields.location;
			if (updateFields.content) body.content = updateFields.content;
			if (updateFields.status) body.status = updateFields.status;

			responseData = await greenhouseApiRequest.call(
				this,
				'PATCH',
				`/job_posts/${jobPostId}`,
				cleanObject(body),
			);
			break;
		}

		case 'getQuestions': {
			const jobPostId = this.getNodeParameter('jobPostId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/job_posts/${jobPostId}/questions`,
			);
			break;
		}
	}

	return responseData;
}
