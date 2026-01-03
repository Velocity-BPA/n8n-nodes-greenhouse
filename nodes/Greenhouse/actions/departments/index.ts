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

export const departmentsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['department'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new department',
				action: 'Create a department',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a department by ID',
				action: 'Get a department',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many departments',
				action: 'Get many departments',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a department',
				action: 'Update a department',
			},
		],
		default: 'getMany',
	},
];

export const departmentsFields: INodeProperties[] = [
	// ----------------------------------
	//         department: get
	// ----------------------------------
	{
		displayName: 'Department ID',
		name: 'departmentId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['department'],
				operation: ['get', 'update'],
			},
		},
		description: 'The ID of the department',
	},

	// ----------------------------------
	//         department: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['department'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	...paginationFields.map((field) => ({
		...field,
		displayOptions: {
			show: {
				resource: ['department'],
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
				resource: ['department'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'External ID',
				name: 'external_id',
				type: 'string',
				default: '',
				description: 'Filter by external ID',
			},
			{
				displayName: 'Render As',
				name: 'render_as',
				type: 'options',
				options: [
					{
						name: 'List',
						value: 'list',
					},
					{
						name: 'Tree',
						value: 'tree',
					},
				],
				default: 'list',
				description: 'How to render the department hierarchy',
			},
		],
	},

	// ----------------------------------
	//         department: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['department'],
				operation: ['create'],
			},
		},
		description: 'The name of the department',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['department'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'External ID',
				name: 'external_id',
				type: 'string',
				default: '',
				description: 'An arbitrary ID provided by an external source',
			},
			{
				displayName: 'Parent Department ID',
				name: 'parent_id',
				type: 'number',
				default: 0,
				description: 'The ID of the parent department (if nested)',
			},
		],
	},

	// ----------------------------------
	//         department: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['department'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'External ID',
				name: 'external_id',
				type: 'string',
				default: '',
				description: 'An arbitrary ID provided by an external source',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the department',
			},
			{
				displayName: 'Parent Department ID',
				name: 'parent_id',
				type: 'number',
				default: 0,
				description: 'The ID of the parent department (if nested)',
			},
		],
	},
];

export async function executeDepartmentsOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const options = this.getNodeParameter('options', index, {}) as {
			external_id?: string;
			render_as?: string;
		};

		const qs: Record<string, string | number> = {};
		if (options.external_id) qs.external_id = options.external_id;
		if (options.render_as) qs.render_as = options.render_as;

		if (returnAll) {
			responseData = await greenhouseApiRequestAllItems.call(
				this,
				'GET',
				'/departments',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.per_page = limit;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				'/departments',
				{},
				qs,
			);
		}
	} else if (operation === 'get') {
		const departmentId = this.getNodeParameter('departmentId', index) as number;
		responseData = await greenhouseApiRequest.call(
			this,
			'GET',
			`/departments/${departmentId}`,
		);
	} else if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
			external_id?: string;
			parent_id?: number;
		};

		const body: IDataObject = { name };
		if (additionalFields.external_id) body.external_id = additionalFields.external_id;
		if (additionalFields.parent_id) body.parent_id = additionalFields.parent_id;

		responseData = await greenhouseApiRequest.call(
			this,
			'POST',
			'/departments',
			body,
		);
	} else if (operation === 'update') {
		const departmentId = this.getNodeParameter('departmentId', index) as number;
		const updateFields = this.getNodeParameter('updateFields', index, {}) as {
			name?: string;
			external_id?: string;
			parent_id?: number;
		};

		const body: IDataObject = {};
		if (updateFields.name) body.name = updateFields.name;
		if (updateFields.external_id) body.external_id = updateFields.external_id;
		if (updateFields.parent_id) body.parent_id = updateFields.parent_id;

		responseData = await greenhouseApiRequest.call(
			this,
			'PATCH',
			`/departments/${departmentId}`,
			body,
		);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
		{ itemData: { item: index } },
	);

	return executionData;
}
