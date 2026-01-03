/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { greenhouseApiRequest, greenhouseApiRequestAllItems } from '../../transport';
import { cleanObject, paginationFields } from '../../utils';

export const applicationFields: INodeProperties[] = [
	// Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Candidate ID',
				name: 'candidateId',
				type: 'string',
				default: '',
				description: 'Filter by candidate ID',
			},
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter applications created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter applications created before this date',
			},
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				default: '',
				description: 'Filter by job ID',
			},
			{
				displayName: 'Last Activity After',
				name: 'lastActivityAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter by last activity date',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Converted', value: 'converted' },
					{ name: 'Hired', value: 'hired' },
					{ name: 'Rejected', value: 'rejected' },
				],
				default: 'active',
				description: 'Filter by application status',
			},
		],
	},
	...paginationFields.map((field) => ({
		...field,
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['getMany'],
			},
		},
	})),

	// Get, Update, Delete, and workflow operations
	{
		displayName: 'Application ID',
		name: 'applicationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['get', 'update', 'delete', 'advance', 'move', 'reject', 'unreject', 'hire', 'transfer'],
			},
		},
		description: 'The ID of the application',
	},

	// Create
	{
		displayName: 'Candidate ID',
		name: 'candidateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['create'],
			},
		},
		description: 'The ID of the candidate',
	},
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['create'],
			},
		},
		description: 'The ID of the job to apply for',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Initial Stage ID',
				name: 'initialStageId',
				type: 'string',
				default: '',
				description: 'The ID of the initial stage',
			},
			{
				displayName: 'Prospect',
				name: 'prospect',
				type: 'boolean',
				default: false,
				description: 'Whether to create as a prospect rather than applicant',
			},
			{
				displayName: 'Referrer',
				name: 'referrer',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						name: 'referrerData',
						displayName: 'Referrer',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'ID', value: 'id' },
									{ name: 'Email', value: 'email' },
									{ name: 'Outside', value: 'outside' },
								],
								default: 'id',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Source ID',
				name: 'sourceId',
				type: 'string',
				default: '',
				description: 'The ID of the source',
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
				resource: ['application'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Credited To',
				name: 'creditedTo',
				type: 'string',
				default: '',
				description: 'The user ID credited with the application',
			},
			{
				displayName: 'Source ID',
				name: 'sourceId',
				type: 'string',
				default: '',
				description: 'The source ID',
			},
		],
	},

	// Move
	{
		displayName: 'Stage ID',
		name: 'stageId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['move'],
			},
		},
		description: 'The ID of the stage to move the application to',
	},

	// Reject
	{
		displayName: 'Rejection Email',
		name: 'rejectionEmail',
		type: 'options',
		options: [
			{ name: 'Send Default', value: 'send_default' },
			{ name: 'Send Custom', value: 'send_custom' },
			{ name: 'Do Not Send', value: 'do_not_send' },
		],
		default: 'do_not_send',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['reject'],
			},
		},
		description: 'Whether to send a rejection email',
	},
	{
		displayName: 'Rejection Reason ID',
		name: 'rejectionReasonId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['reject'],
			},
		},
		description: 'The ID of the rejection reason',
	},
	{
		displayName: 'Rejection Notes',
		name: 'rejectionNotes',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['reject'],
			},
		},
		description: 'Notes about the rejection',
	},

	// Hire
	{
		displayName: 'Opening ID',
		name: 'openingId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['hire'],
			},
		},
		description: 'The ID of the job opening to fill',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['hire'],
			},
		},
		description: 'The start date for the new hire',
	},
	{
		displayName: 'Close Reason ID',
		name: 'closeReasonId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['hire'],
			},
		},
		description: 'The ID of the close reason for the opening',
	},

	// Transfer
	{
		displayName: 'New Job ID',
		name: 'newJobId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['transfer'],
			},
		},
		description: 'The ID of the job to transfer the application to',
	},
	{
		displayName: 'New Stage ID',
		name: 'newStageId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['transfer'],
			},
		},
		description: 'The ID of the stage in the new job',
	},
];

export async function executeApplicationOperation(
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
			if (filters.candidateId) qs.candidate_id = filters.candidateId;
			if (filters.jobId) qs.job_id = filters.jobId;
			if (filters.status) qs.status = filters.status;
			if (filters.createdAfter) qs.created_after = filters.createdAfter;
			if (filters.createdBefore) qs.created_before = filters.createdBefore;
			if (filters.lastActivityAfter) qs.last_activity_after = filters.lastActivityAfter;

			if (returnAll) {
				responseData = await greenhouseApiRequestAllItems.call(
					this,
					'GET',
					'/applications',
					{},
					qs,
				);
			} else {
				qs.per_page = limit;
				responseData = await greenhouseApiRequest.call(
					this,
					'GET',
					'/applications',
					{},
					qs,
				);
			}
			break;
		}

		case 'get': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/applications/${applicationId}`,
			);
			break;
		}

		case 'create': {
			const candidateId = this.getNodeParameter('candidateId', i) as string;
			const jobId = this.getNodeParameter('jobId', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				job_id: Number(jobId),
			};

			if (additionalFields.sourceId) body.source_id = Number(additionalFields.sourceId);
			if (additionalFields.initialStageId) body.initial_stage_id = Number(additionalFields.initialStageId);
			if (additionalFields.prospect !== undefined) body.prospect = additionalFields.prospect;

			if (additionalFields.referrer) {
				const referrerData = (additionalFields.referrer as IDataObject).referrerData as IDataObject;
				if (referrerData) {
					body.referrer = {
						type: referrerData.type,
						value: referrerData.value,
					};
				}
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/candidates/${candidateId}/applications`,
				body,
			);
			break;
		}

		case 'update': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.sourceId) body.source_id = Number(updateFields.sourceId);
			if (updateFields.creditedTo) body.credited_to = Number(updateFields.creditedTo);

			responseData = await greenhouseApiRequest.call(
				this,
				'PATCH',
				`/applications/${applicationId}`,
				cleanObject(body),
			);
			break;
		}

		case 'delete': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'DELETE',
				`/applications/${applicationId}`,
			);
			responseData = { success: true };
			break;
		}

		case 'advance': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/applications/${applicationId}/advance`,
			);
			break;
		}

		case 'move': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			const stageId = this.getNodeParameter('stageId', i) as string;

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/applications/${applicationId}/move`,
				{
					to_stage_id: Number(stageId),
				},
			);
			break;
		}

		case 'reject': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			const rejectionEmail = this.getNodeParameter('rejectionEmail', i) as string;
			const rejectionReasonId = this.getNodeParameter('rejectionReasonId', i, '') as string;
			const rejectionNotes = this.getNodeParameter('rejectionNotes', i, '') as string;

			const body: IDataObject = {};
			if (rejectionEmail !== 'do_not_send') {
				body.rejection_email = {
					send_email_at: new Date().toISOString(),
					email_template_id: rejectionEmail === 'send_custom' ? undefined : 'default',
				};
			}
			if (rejectionReasonId) body.rejection_reason_id = Number(rejectionReasonId);
			if (rejectionNotes) body.notes = rejectionNotes;

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/applications/${applicationId}/reject`,
				cleanObject(body),
			);
			break;
		}

		case 'unreject': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/applications/${applicationId}/unreject`,
			);
			break;
		}

		case 'hire': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			const openingId = this.getNodeParameter('openingId', i, '') as string;
			const startDate = this.getNodeParameter('startDate', i, '') as string;
			const closeReasonId = this.getNodeParameter('closeReasonId', i, '') as string;

			const body: IDataObject = {};
			if (openingId) body.opening_id = Number(openingId);
			if (startDate) body.start_date = startDate;
			if (closeReasonId) body.close_reason_id = Number(closeReasonId);

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/applications/${applicationId}/hire`,
				cleanObject(body),
			);
			break;
		}

		case 'transfer': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			const newJobId = this.getNodeParameter('newJobId', i) as string;
			const newStageId = this.getNodeParameter('newStageId', i, '') as string;

			const body: IDataObject = {
				new_job_id: Number(newJobId),
			};
			if (newStageId) body.new_stage_id = Number(newStageId);

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/applications/${applicationId}/transfer_to_job`,
				body,
			);
			break;
		}
	}

	return responseData;
}
