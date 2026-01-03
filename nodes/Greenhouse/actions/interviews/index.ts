/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { greenhouseApiRequest, greenhouseApiRequestAllItems } from '../../transport';
import { cleanObject, paginationFields } from '../../utils';

export const interviewFields: INodeProperties[] = [
	// Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['interview'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Application ID',
				name: 'applicationId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Ends After',
				name: 'endsAfter',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Ends Before',
				name: 'endsBefore',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Starts After',
				name: 'startsAfter',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Starts Before',
				name: 'startsBefore',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Updated After',
				name: 'updatedAfter',
				type: 'dateTime',
				default: '',
			},
		],
	},
	...paginationFields.map((field) => ({
		...field,
		displayOptions: {
			show: {
				resource: ['interview'],
				operation: ['getMany'],
			},
		},
	})),

	// Interview ID
	{
		displayName: 'Interview ID',
		name: 'interviewId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['interview'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the scheduled interview',
	},

	// Create
	{
		displayName: 'Application ID',
		name: 'applicationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['interview'],
				operation: ['create'],
			},
		},
		description: 'The ID of the application',
	},
	{
		displayName: 'Interview Type ID',
		name: 'interviewTypeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['interview'],
				operation: ['create'],
			},
		},
		description: 'The ID of the interview type',
	},
	{
		displayName: 'Start Time',
		name: 'startTime',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['interview'],
				operation: ['create'],
			},
		},
		description: 'The start time of the interview',
	},
	{
		displayName: 'End Time',
		name: 'endTime',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['interview'],
				operation: ['create'],
			},
		},
		description: 'The end time of the interview',
	},
	{
		displayName: 'Interview Options',
		name: 'interviewOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['interview'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Interviewer IDs',
				name: 'interviewerIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of interviewer user IDs',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Video Conferencing URL',
				name: 'videoConferencingUrl',
				type: 'string',
				default: '',
			},
		],
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
				resource: ['interview'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Interviewer IDs',
				name: 'interviewerIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of interviewer user IDs',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Video Conferencing URL',
				name: 'videoConferencingUrl',
				type: 'string',
				default: '',
			},
		],
	},
];

export async function executeInterviewOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const limit = this.getNodeParameter('limit', i, 50) as number;
			const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.applicationId) qs.application_id = filters.applicationId;
			if (filters.startsAfter) qs.starts_after = filters.startsAfter;
			if (filters.startsBefore) qs.starts_before = filters.startsBefore;
			if (filters.endsAfter) qs.ends_after = filters.endsAfter;
			if (filters.endsBefore) qs.ends_before = filters.endsBefore;
			if (filters.createdAfter) qs.created_after = filters.createdAfter;
			if (filters.updatedAfter) qs.updated_after = filters.updatedAfter;

			if (returnAll) {
				responseData = await greenhouseApiRequestAllItems.call(
					this,
					'GET',
					'/scheduled_interviews',
					{},
					qs,
				);
			} else {
				qs.per_page = limit;
				responseData = await greenhouseApiRequest.call(
					this,
					'GET',
					'/scheduled_interviews',
					{},
					qs,
				);
			}
			break;
		}

		case 'get': {
			const interviewId = this.getNodeParameter('interviewId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/scheduled_interviews/${interviewId}`,
			);
			break;
		}

		case 'create': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			const interviewTypeId = this.getNodeParameter('interviewTypeId', i) as string;
			const startTime = this.getNodeParameter('startTime', i) as string;
			const endTime = this.getNodeParameter('endTime', i) as string;
			const interviewOptions = this.getNodeParameter('interviewOptions', i, {}) as IDataObject;

			const body: IDataObject = {
				interview_id: Number(interviewTypeId),
				start: startTime,
				end: endTime,
			};

			if (interviewOptions.location) body.location = interviewOptions.location;
			if (interviewOptions.videoConferencingUrl) body.video_conferencing_url = interviewOptions.videoConferencingUrl;

			if (interviewOptions.interviewerIds) {
				body.interviewers = (interviewOptions.interviewerIds as string)
					.split(',')
					.map((id) => ({ user_id: Number(id.trim()) }));
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/applications/${applicationId}/scheduled_interviews`,
				cleanObject(body),
			);
			break;
		}

		case 'update': {
			const interviewId = this.getNodeParameter('interviewId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.startTime) body.start = updateFields.startTime;
			if (updateFields.endTime) body.end = updateFields.endTime;
			if (updateFields.location) body.location = updateFields.location;
			if (updateFields.videoConferencingUrl) body.video_conferencing_url = updateFields.videoConferencingUrl;

			if (updateFields.interviewerIds) {
				body.interviewers = (updateFields.interviewerIds as string)
					.split(',')
					.map((id) => ({ user_id: Number(id.trim()) }));
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'PATCH',
				`/scheduled_interviews/${interviewId}`,
				cleanObject(body),
			);
			break;
		}

		case 'delete': {
			const interviewId = this.getNodeParameter('interviewId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'DELETE',
				`/scheduled_interviews/${interviewId}`,
			);
			responseData = { success: true };
			break;
		}
	}

	return responseData;
}
