/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { greenhouseApiRequest, greenhouseApiRequestAllItems } from '../../transport';
import { cleanObject, paginationFields } from '../../utils';

export const jobFields: INodeProperties[] = [
	// Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Department ID',
				name: 'departmentId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Office ID',
				name: 'officeId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Open', value: 'open' },
					{ name: 'Closed', value: 'closed' },
					{ name: 'Draft', value: 'draft' },
				],
				default: 'open',
			},
		],
	},
	...paginationFields.map((field) => ({
		...field,
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['getMany'],
			},
		},
	})),

	// Job ID for get/update/stages/openings/hiringTeam
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['get', 'update', 'getStages', 'getOpenings', 'createOpening', 'getHiringTeam'],
			},
		},
		description: 'The ID of the job',
	},

	// Create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
		description: 'The name of the job',
	},
	{
		displayName: 'Template Job ID',
		name: 'templateJobId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
		description: 'The ID of the job template to use',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Department ID',
				name: 'departmentId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'External Job Board Name',
				name: 'externalJobBoardName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Number of Openings',
				name: 'numberOfOpenings',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
			},
			{
				displayName: 'Office IDs',
				name: 'officeIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of office IDs',
			},
			{
				displayName: 'Opening IDs',
				name: 'openingIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of opening IDs',
			},
			{
				displayName: 'Requisition ID',
				name: 'requisitionId',
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
				resource: ['job'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Anywhere',
				name: 'anywhere',
				type: 'boolean',
				default: false,
				description: 'Whether the job can be worked from anywhere',
			},
			{
				displayName: 'Confidential',
				name: 'confidential',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Department ID',
				name: 'departmentId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
			},
			{
				displayName: 'Requisition ID',
				name: 'requisitionId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Open', value: 'open' },
					{ name: 'Closed', value: 'closed' },
				],
				default: 'open',
			},
			{
				displayName: 'Team And Responsibilities',
				name: 'teamAndResponsibilities',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
			},
		],
	},

	// Opening ID for update/close
	{
		displayName: 'Opening ID',
		name: 'openingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['updateOpening', 'closeOpening'],
			},
		},
		description: 'The ID of the opening',
	},

	// Create Opening
	{
		displayName: 'Opening Options',
		name: 'openingOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['createOpening'],
			},
		},
		options: [
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field ID',
								name: 'id',
								type: 'string',
								default: '',
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
				displayName: 'Opening ID',
				name: 'openingId',
				type: 'string',
				default: '',
				description: 'A custom ID for the opening',
			},
			{
				displayName: 'Target Start Date',
				name: 'targetStartDate',
				type: 'dateTime',
				default: '',
			},
		],
	},

	// Update Opening
	{
		displayName: 'Update Opening Fields',
		name: 'updateOpeningFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['updateOpening'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Open', value: 'open' },
					{ name: 'Closed', value: 'closed' },
				],
				default: 'open',
			},
			{
				displayName: 'Target Start Date',
				name: 'targetStartDate',
				type: 'dateTime',
				default: '',
			},
		],
	},

	// Close Opening
	{
		displayName: 'Close Reason ID',
		name: 'closeReasonId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['closeOpening'],
			},
		},
		description: 'The ID of the reason for closing',
	},
];

export async function executeJobOperation(
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
			if (filters.departmentId) qs.department_id = filters.departmentId;
			if (filters.officeId) qs.office_id = filters.officeId;
			if (filters.status) qs.status = filters.status;
			if (filters.createdAfter) qs.created_after = filters.createdAfter;
			if (filters.createdBefore) qs.created_before = filters.createdBefore;

			if (returnAll) {
				responseData = await greenhouseApiRequestAllItems.call(
					this,
					'GET',
					'/jobs',
					{},
					qs,
				);
			} else {
				qs.per_page = limit;
				responseData = await greenhouseApiRequest.call(
					this,
					'GET',
					'/jobs',
					{},
					qs,
				);
			}
			break;
		}

		case 'get': {
			const jobId = this.getNodeParameter('jobId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/jobs/${jobId}`,
			);
			break;
		}

		case 'create': {
			const name = this.getNodeParameter('name', i) as string;
			const templateJobId = this.getNodeParameter('templateJobId', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				name,
				template_job_id: Number(templateJobId),
			};

			if (additionalFields.departmentId) body.department_id = Number(additionalFields.departmentId);
			if (additionalFields.requisitionId) body.requisition_id = additionalFields.requisitionId;
			if (additionalFields.numberOfOpenings) body.number_of_openings = additionalFields.numberOfOpenings;
			if (additionalFields.externalJobBoardName) body.external_job_board_name = additionalFields.externalJobBoardName;

			if (additionalFields.officeIds) {
				body.office_ids = (additionalFields.officeIds as string).split(',').map((id) => Number(id.trim()));
			}
			if (additionalFields.openingIds) {
				body.opening_ids = (additionalFields.openingIds as string).split(',').map((id) => id.trim());
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				'/jobs',
				body,
			);
			break;
		}

		case 'update': {
			const jobId = this.getNodeParameter('jobId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.name) body.name = updateFields.name;
			if (updateFields.requisitionId) body.requisition_id = updateFields.requisitionId;
			if (updateFields.notes) body.notes = updateFields.notes;
			if (updateFields.status) body.status = updateFields.status;
			if (updateFields.departmentId) body.department_id = Number(updateFields.departmentId);
			if (updateFields.confidential !== undefined) body.confidential = updateFields.confidential;
			if (updateFields.anywhere !== undefined) body.anywhere = updateFields.anywhere;
			if (updateFields.teamAndResponsibilities) body.team_and_responsibilities = updateFields.teamAndResponsibilities;

			responseData = await greenhouseApiRequest.call(
				this,
				'PATCH',
				`/jobs/${jobId}`,
				cleanObject(body),
			);
			break;
		}

		case 'getStages': {
			const jobId = this.getNodeParameter('jobId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/jobs/${jobId}/stages`,
			);
			break;
		}

		case 'getOpenings': {
			const jobId = this.getNodeParameter('jobId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/jobs/${jobId}/openings`,
			);
			break;
		}

		case 'createOpening': {
			const jobId = this.getNodeParameter('jobId', i) as string;
			const openingOptions = this.getNodeParameter('openingOptions', i, {}) as IDataObject;

			const body: IDataObject = {};
			if (openingOptions.openingId) body.opening_id = openingOptions.openingId;
			if (openingOptions.targetStartDate) body.target_start_date = openingOptions.targetStartDate;

			if (openingOptions.customFields) {
				const fields = (openingOptions.customFields as IDataObject).field as IDataObject[];
				if (fields?.length) {
					body.custom_fields = fields;
				}
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/jobs/${jobId}/openings`,
				cleanObject(body),
			);
			break;
		}

		case 'updateOpening': {
			const openingId = this.getNodeParameter('openingId', i) as string;
			const updateOpeningFields = this.getNodeParameter('updateOpeningFields', i, {}) as IDataObject;

			const body: IDataObject = {};
			if (updateOpeningFields.status) body.status = updateOpeningFields.status;
			if (updateOpeningFields.targetStartDate) body.target_start_date = updateOpeningFields.targetStartDate;

			responseData = await greenhouseApiRequest.call(
				this,
				'PATCH',
				`/openings/${openingId}`,
				cleanObject(body),
			);
			break;
		}

		case 'closeOpening': {
			const openingId = this.getNodeParameter('openingId', i) as string;
			const closeReasonId = this.getNodeParameter('closeReasonId', i, '') as string;

			const body: IDataObject = {};
			if (closeReasonId) body.close_reason_id = Number(closeReasonId);

			responseData = await greenhouseApiRequest.call(
				this,
				'DELETE',
				`/openings/${openingId}`,
				cleanObject(body),
			);
			responseData = { success: true };
			break;
		}

		case 'getHiringTeam': {
			const jobId = this.getNodeParameter('jobId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/jobs/${jobId}/hiring_team`,
			);
			break;
		}
	}

	return responseData;
}
