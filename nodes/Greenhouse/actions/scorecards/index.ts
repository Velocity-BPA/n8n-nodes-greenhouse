/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { greenhouseApiRequest, greenhouseApiRequestAllItems } from '../../transport';
import { cleanObject, paginationFields } from '../../utils';

export const scorecardFields: INodeProperties[] = [
	// Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['scorecard'],
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
				displayName: 'Interview ID',
				name: 'interviewId',
				type: 'string',
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
				resource: ['scorecard'],
				operation: ['getMany'],
			},
		},
	})),

	// Scorecard ID
	{
		displayName: 'Scorecard ID',
		name: 'scorecardId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['scorecard'],
				operation: ['get', 'update'],
			},
		},
		description: 'The ID of the scorecard',
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
				resource: ['scorecard'],
				operation: ['create'],
			},
		},
		description: 'The ID of the application',
	},
	{
		displayName: 'Interview ID',
		name: 'interviewId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['scorecard'],
				operation: ['create'],
			},
		},
		description: 'The ID of the interview',
	},
	{
		displayName: 'Overall Recommendation',
		name: 'overallRecommendation',
		type: 'options',
		options: [
			{ name: 'Strong Yes', value: 'strong_yes' },
			{ name: 'Yes', value: 'yes' },
			{ name: 'No Decision', value: 'no_decision' },
			{ name: 'No', value: 'no' },
			{ name: 'Strong No', value: 'strong_no' },
		],
		default: 'no_decision',
		displayOptions: {
			show: {
				resource: ['scorecard'],
				operation: ['create'],
			},
		},
		description: 'The overall recommendation',
	},
	{
		displayName: 'Scorecard Options',
		name: 'scorecardOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['scorecard'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Attributes',
				name: 'attributes',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'attribute',
						displayName: 'Attribute',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Rating',
								name: 'rating',
								type: 'options',
								options: [
									{ name: 'Strong Yes', value: 'strong_yes' },
									{ name: 'Yes', value: 'yes' },
									{ name: 'Mixed', value: 'mixed' },
									{ name: 'No', value: 'no' },
									{ name: 'Strong No', value: 'strong_no' },
								],
								default: 'mixed',
							},
							{
								displayName: 'Notes',
								name: 'notes',
								type: 'string',
								default: '',
							},
						],
					},
				],
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
				resource: ['scorecard'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Attributes',
				name: 'attributes',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'attribute',
						displayName: 'Attribute',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Rating',
								name: 'rating',
								type: 'options',
								options: [
									{ name: 'Strong Yes', value: 'strong_yes' },
									{ name: 'Yes', value: 'yes' },
									{ name: 'Mixed', value: 'mixed' },
									{ name: 'No', value: 'no' },
									{ name: 'Strong No', value: 'strong_no' },
								],
								default: 'mixed',
							},
							{
								displayName: 'Notes',
								name: 'notes',
								type: 'string',
								default: '',
							},
						],
					},
				],
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
				displayName: 'Overall Recommendation',
				name: 'overallRecommendation',
				type: 'options',
				options: [
					{ name: 'Strong Yes', value: 'strong_yes' },
					{ name: 'Yes', value: 'yes' },
					{ name: 'No Decision', value: 'no_decision' },
					{ name: 'No', value: 'no' },
					{ name: 'Strong No', value: 'strong_no' },
				],
				default: 'no_decision',
			},
		],
	},
];

export async function executeScorecardOperation(
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
			if (filters.interviewId) qs.interview_id = filters.interviewId;
			if (filters.createdAfter) qs.created_after = filters.createdAfter;
			if (filters.updatedAfter) qs.updated_after = filters.updatedAfter;

			if (returnAll) {
				responseData = await greenhouseApiRequestAllItems.call(
					this,
					'GET',
					'/scorecards',
					{},
					qs,
				);
			} else {
				qs.per_page = limit;
				responseData = await greenhouseApiRequest.call(
					this,
					'GET',
					'/scorecards',
					{},
					qs,
				);
			}
			break;
		}

		case 'get': {
			const scorecardId = this.getNodeParameter('scorecardId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/scorecards/${scorecardId}`,
			);
			break;
		}

		case 'create': {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			const interviewId = this.getNodeParameter('interviewId', i) as string;
			const overallRecommendation = this.getNodeParameter('overallRecommendation', i) as string;
			const scorecardOptions = this.getNodeParameter('scorecardOptions', i, {}) as IDataObject;

			const body: IDataObject = {
				interview: Number(interviewId),
				overall_recommendation: overallRecommendation,
			};

			if (scorecardOptions.notes) body.notes = scorecardOptions.notes;

			if (scorecardOptions.attributes) {
				const attrs = (scorecardOptions.attributes as IDataObject).attribute as IDataObject[];
				if (attrs?.length) {
					body.attributes = attrs;
				}
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/applications/${applicationId}/scorecards`,
				cleanObject(body),
			);
			break;
		}

		case 'update': {
			const scorecardId = this.getNodeParameter('scorecardId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.overallRecommendation) body.overall_recommendation = updateFields.overallRecommendation;
			if (updateFields.notes) body.notes = updateFields.notes;

			if (updateFields.attributes) {
				const attrs = (updateFields.attributes as IDataObject).attribute as IDataObject[];
				if (attrs?.length) {
					body.attributes = attrs;
				}
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'PATCH',
				`/scorecards/${scorecardId}`,
				cleanObject(body),
			);
			break;
		}
	}

	return responseData;
}
