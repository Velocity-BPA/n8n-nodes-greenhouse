/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { greenhouseApiRequest, greenhouseApiRequestAllItems } from '../../transport';
import { cleanObject, paginationFields } from '../../utils';

export const userFields: INodeProperties[] = [
	// Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
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
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
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
				resource: ['user'],
				operation: ['getMany'],
			},
		},
	})),

	// User ID
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'disable', 'enable', 'updatePermissions'],
			},
		},
		description: 'The ID of the user',
	},

	// Create
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Office IDs',
				name: 'officeIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of office IDs',
			},
			{
				displayName: 'Send Email Invite',
				name: 'sendEmailInvite',
				type: 'boolean',
				default: true,
			},
		],
	},

	// Update Permissions
	{
		displayName: 'Permissions',
		name: 'permissions',
		type: 'collection',
		placeholder: 'Add Permission',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['updatePermissions'],
			},
		},
		options: [
			{
				displayName: 'Department IDs',
				name: 'departmentIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of department IDs',
			},
			{
				displayName: 'Job Admin Job IDs',
				name: 'jobAdminJobIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of job IDs for job admin access',
			},
			{
				displayName: 'Office IDs',
				name: 'officeIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of office IDs',
			},
			{
				displayName: 'User Role',
				name: 'userRole',
				type: 'options',
				options: [
					{ name: 'Basic', value: 'basic' },
					{ name: 'Interviewer', value: 'interviewer' },
					{ name: 'Hiring Manager', value: 'hiring_manager' },
					{ name: 'Job Admin', value: 'job_admin' },
					{ name: 'Extended Job Admin', value: 'extended_job_admin' },
					{ name: 'Site Admin', value: 'site_admin' },
				],
				default: 'basic',
			},
		],
	},
];

export async function executeUserOperation(
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
			if (filters.email) qs.email = filters.email;
			if (filters.employeeId) qs.employee_id = filters.employeeId;
			if (filters.createdAfter) qs.created_after = filters.createdAfter;
			if (filters.updatedAfter) qs.updated_after = filters.updatedAfter;

			if (returnAll) {
				responseData = await greenhouseApiRequestAllItems.call(
					this,
					'GET',
					'/users',
					{},
					qs,
				);
			} else {
				qs.per_page = limit;
				responseData = await greenhouseApiRequest.call(
					this,
					'GET',
					'/users',
					{},
					qs,
				);
			}
			break;
		}

		case 'get': {
			const userId = this.getNodeParameter('userId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/users/${userId}`,
			);
			break;
		}

		case 'getCurrent': {
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				'/users/me',
			);
			break;
		}

		case 'create': {
			const firstName = this.getNodeParameter('firstName', i) as string;
			const lastName = this.getNodeParameter('lastName', i) as string;
			const email = this.getNodeParameter('email', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				first_name: firstName,
				last_name: lastName,
				email,
			};

			if (additionalFields.employeeId) body.employee_id = additionalFields.employeeId;
			if (additionalFields.sendEmailInvite !== undefined) body.send_email_invite = additionalFields.sendEmailInvite;

			if (additionalFields.officeIds) {
				body.office_ids = (additionalFields.officeIds as string).split(',').map((id) => Number(id.trim()));
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				'/users',
				cleanObject(body),
			);
			break;
		}

		case 'disable': {
			const userId = this.getNodeParameter('userId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'PATCH',
				`/users/${userId}/disable`,
			);
			break;
		}

		case 'enable': {
			const userId = this.getNodeParameter('userId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'PATCH',
				`/users/${userId}/enable`,
			);
			break;
		}

		case 'updatePermissions': {
			const userId = this.getNodeParameter('userId', i) as string;
			const permissions = this.getNodeParameter('permissions', i, {}) as IDataObject;

			const body: IDataObject = {};
			if (permissions.userRole) body.user_role = permissions.userRole;

			if (permissions.officeIds) {
				body.office_ids = (permissions.officeIds as string).split(',').map((id) => Number(id.trim()));
			}
			if (permissions.departmentIds) {
				body.department_ids = (permissions.departmentIds as string).split(',').map((id) => Number(id.trim()));
			}
			if (permissions.jobAdminJobIds) {
				body.job_admin_job_ids = (permissions.jobAdminJobIds as string).split(',').map((id) => Number(id.trim()));
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'PUT',
				`/users/${userId}/permissions`,
				cleanObject(body),
			);
			break;
		}
	}

	return responseData;
}
