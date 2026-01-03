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

export const customFieldsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customField'],
			},
		},
		options: [
			{
				name: 'Create Options',
				value: 'createOptions',
				description: 'Add options to a custom field',
				action: 'Create options for a custom field',
			},
			{
				name: 'Delete Options',
				value: 'deleteOptions',
				description: 'Delete options from a custom field',
				action: 'Delete options from a custom field',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a custom field by ID',
				action: 'Get a custom field',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many custom fields',
				action: 'Get many custom fields',
			},
		],
		default: 'getMany',
	},
];

export const customFieldsFields: INodeProperties[] = [
	// ----------------------------------
	//         customField: get
	// ----------------------------------
	{
		displayName: 'Custom Field ID',
		name: 'customFieldId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['customField'],
				operation: ['get', 'createOptions', 'deleteOptions'],
			},
		},
		description: 'The ID of the custom field',
	},

	// ----------------------------------
	//         customField: getMany
	// ----------------------------------
	{
		displayName: 'Field Type',
		name: 'fieldType',
		type: 'options',
		required: true,
		default: 'candidate',
		displayOptions: {
			show: {
				resource: ['customField'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				name: 'Application',
				value: 'application',
			},
			{
				name: 'Candidate',
				value: 'candidate',
			},
			{
				name: 'Job',
				value: 'job',
			},
			{
				name: 'Offer',
				value: 'offer',
			},
			{
				name: 'Opening',
				value: 'opening',
			},
			{
				name: 'Rejection Question',
				value: 'rejection_question',
			},
			{
				name: 'Referral Question',
				value: 'referral_question',
			},
		],
		description: 'The type of object the custom fields belong to',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['customField'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	...paginationFields.map((field) => ({
		...field,
		displayOptions: {
			show: {
				resource: ['customField'],
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
				resource: ['customField'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Include Inactive',
				name: 'include_inactive',
				type: 'boolean',
				default: false,
				description: 'Whether to include inactive custom fields',
			},
		],
	},

	// ----------------------------------
	//         customField: createOptions
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'fieldOptions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['customField'],
				operation: ['createOptions'],
			},
		},
		options: [
			{
				name: 'option',
				displayName: 'Option',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						required: true,
						description: 'The name of the option',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'number',
						default: 0,
						description: 'The priority/sort order of the option',
					},
					{
						displayName: 'External ID',
						name: 'external_id',
						type: 'string',
						default: '',
						description: 'An arbitrary ID provided by an external source',
					},
				],
			},
		],
		description: 'The options to add to the custom field',
	},

	// ----------------------------------
	//         customField: deleteOptions
	// ----------------------------------
	{
		displayName: 'Option IDs',
		name: 'optionIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customField'],
				operation: ['deleteOptions'],
			},
		},
		description: 'Comma-separated list of option IDs to delete',
	},
];

export async function executeCustomFieldsOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	if (operation === 'getMany') {
		const fieldType = this.getNodeParameter('fieldType', index) as string;
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const options = this.getNodeParameter('options', index, {}) as {
			include_inactive?: boolean;
		};

		const qs: Record<string, string | number | boolean> = {};
		if (options.include_inactive) qs.include_inactive = options.include_inactive;

		if (returnAll) {
			responseData = await greenhouseApiRequestAllItems.call(
				this,
				'GET',
				`/custom_fields/${fieldType}`,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.per_page = limit;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/custom_fields/${fieldType}`,
				{},
				qs,
			);
		}
	} else if (operation === 'get') {
		const customFieldId = this.getNodeParameter('customFieldId', index) as number;
		responseData = await greenhouseApiRequest.call(
			this,
			'GET',
			`/custom_field/${customFieldId}`,
		);
	} else if (operation === 'createOptions') {
		const customFieldId = this.getNodeParameter('customFieldId', index) as number;
		const fieldOptions = this.getNodeParameter('fieldOptions', index, {}) as {
			option?: Array<{
				name: string;
				priority?: number;
				external_id?: string;
			}>;
		};

		const options = (fieldOptions.option || []).map((opt) => {
			const option: IDataObject = { name: opt.name };
			if (opt.priority !== undefined) option.priority = opt.priority;
			if (opt.external_id) option.external_id = opt.external_id;
			return option;
		});

		responseData = await greenhouseApiRequest.call(
			this,
			'POST',
			`/custom_field/${customFieldId}/custom_field_options`,
			{ options },
		);
	} else if (operation === 'deleteOptions') {
		const customFieldId = this.getNodeParameter('customFieldId', index) as number;
		const optionIdsString = this.getNodeParameter('optionIds', index) as string;
		const optionIds = optionIdsString.split(',').map((id) => parseInt(id.trim(), 10));

		responseData = await greenhouseApiRequest.call(
			this,
			'DELETE',
			`/custom_field/${customFieldId}/custom_field_options`,
			{ option_ids: optionIds },
		);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
		{ itemData: { item: index } },
	);

	return executionData;
}
