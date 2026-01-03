/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { greenhouseApiRequest, greenhouseApiRequestAllItems } from '../../transport';
import { cleanObject, paginationFields } from '../../utils';

export const offerFields: INodeProperties[] = [
	// Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['offer'],
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
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Resolved After',
				name: 'resolvedAfter',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Sent After',
				name: 'sentAfter',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Accepted', value: 'accepted' },
					{ name: 'Created', value: 'created' },
					{ name: 'Deprecated', value: 'deprecated' },
					{ name: 'Rejected', value: 'rejected' },
					{ name: 'Sent', value: 'sent' },
				],
				default: 'created',
			},
		],
	},
	...paginationFields.map((field) => ({
		...field,
		displayOptions: {
			show: {
				resource: ['offer'],
				operation: ['getMany'],
			},
		},
	})),

	// Offer ID
	{
		displayName: 'Offer ID',
		name: 'offerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['offer'],
				operation: ['get', 'update'],
			},
		},
		description: 'The ID of the offer',
	},

	// Application ID for create and getCurrent
	{
		displayName: 'Application ID',
		name: 'applicationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['offer'],
				operation: ['create', 'getCurrent'],
			},
		},
		description: 'The ID of the application',
	},

	// Create
	{
		displayName: 'Offer Fields',
		name: 'offerFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['offer'],
				operation: ['create'],
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
			},
			{
				displayName: 'Sent At',
				name: 'sentAt',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
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
				resource: ['offer'],
				operation: ['update'],
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
			},
			{
				displayName: 'Sent At',
				name: 'sentAt',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
			},
		],
	},
];

export async function executeOfferOperation(
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
			if (filters.status) qs.status = filters.status;
			if (filters.createdAfter) qs.created_after = filters.createdAfter;
			if (filters.createdBefore) qs.created_before = filters.createdBefore;
			if (filters.sentAfter) qs.sent_after = filters.sentAfter;
			if (filters.resolvedAfter) qs.resolved_after = filters.resolvedAfter;

			if (returnAll) {
				responseData = await greenhouseApiRequestAllItems.call(
					this,
					'GET',
					'/offers',
					{},
					qs,
				);
			} else {
				qs.per_page = limit;
				responseData = await greenhouseApiRequest.call(
					this,
					'GET',
					'/offers',
					{},
					qs,
				);
			}
			break;
		}

		case 'get': {
			const offerId = this.getNodeParameter('offerId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/offers/${offerId}`,
			);
			break;
		}

		case 'getCurrent': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/applications/${applicationId}/offers/current_offer`,
			);
			break;
		}

		case 'create': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			const offerFieldsData = this.getNodeParameter('offerFields', i, {}) as IDataObject;

			const body: IDataObject = {};
			if (offerFieldsData.openingId) body.opening_id = Number(offerFieldsData.openingId);
			if (offerFieldsData.startDate) body.start_date = offerFieldsData.startDate;
			if (offerFieldsData.sentAt) body.sent_at = offerFieldsData.sentAt;

			if (offerFieldsData.customFields) {
				const fields = (offerFieldsData.customFields as IDataObject).field as IDataObject[];
				if (fields?.length) {
					body.custom_fields = fields;
				}
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/applications/${applicationId}/offers`,
				cleanObject(body),
			);
			break;
		}

		case 'update': {
			const offerId = this.getNodeParameter('offerId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.openingId) body.opening_id = Number(updateFields.openingId);
			if (updateFields.startDate) body.start_date = updateFields.startDate;
			if (updateFields.sentAt) body.sent_at = updateFields.sentAt;

			if (updateFields.customFields) {
				const fields = (updateFields.customFields as IDataObject).field as IDataObject[];
				if (fields?.length) {
					body.custom_fields = fields;
				}
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'PATCH',
				`/offers/${offerId}`,
				cleanObject(body),
			);
			break;
		}
	}

	return responseData;
}
