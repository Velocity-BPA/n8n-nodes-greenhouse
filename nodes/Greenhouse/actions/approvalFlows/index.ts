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
import { greenhouseApiRequest } from '../../transport';

export const approvalFlowsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['approvalFlow'],
			},
		},
		options: [
			{
				name: 'Get for Job',
				value: 'getForJob',
				description: 'Get approval flow for a job',
				action: 'Get approval flow for a job',
			},
			{
				name: 'Get for Offer',
				value: 'getForOffer',
				description: 'Get approval flow for an offer',
				action: 'Get approval flow for an offer',
			},
			{
				name: 'Request Approvals',
				value: 'requestApprovals',
				description: 'Request approvals for a job or offer',
				action: 'Request approvals',
			},
			{
				name: 'Replace Approvers',
				value: 'replaceApprovers',
				description: 'Replace approvers in an approval flow',
				action: 'Replace approvers',
			},
		],
		default: 'getForJob',
	},
];

export const approvalFlowsFields: INodeProperties[] = [
	// ----------------------------------
	//         approvalFlow: getForJob
	// ----------------------------------
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['approvalFlow'],
				operation: ['getForJob'],
			},
		},
		description: 'The ID of the job',
	},

	// ----------------------------------
	//         approvalFlow: getForOffer
	// ----------------------------------
	{
		displayName: 'Offer ID',
		name: 'offerId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['approvalFlow'],
				operation: ['getForOffer'],
			},
		},
		description: 'The ID of the offer',
	},

	// ----------------------------------
	//         approvalFlow: requestApprovals
	// ----------------------------------
	{
		displayName: 'Approval Type',
		name: 'approvalType',
		type: 'options',
		required: true,
		default: 'job',
		displayOptions: {
			show: {
				resource: ['approvalFlow'],
				operation: ['requestApprovals'],
			},
		},
		options: [
			{
				name: 'Job',
				value: 'job',
			},
			{
				name: 'Offer',
				value: 'offer',
			},
		],
		description: 'The type of approval to request',
	},
	{
		displayName: 'Job ID',
		name: 'jobIdForApproval',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['approvalFlow'],
				operation: ['requestApprovals'],
				approvalType: ['job'],
			},
		},
		description: 'The ID of the job to request approval for',
	},
	{
		displayName: 'Offer ID',
		name: 'offerIdForApproval',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['approvalFlow'],
				operation: ['requestApprovals'],
				approvalType: ['offer'],
			},
		},
		description: 'The ID of the offer to request approval for',
	},

	// ----------------------------------
	//         approvalFlow: replaceApprovers
	// ----------------------------------
	{
		displayName: 'Replace Approval Type',
		name: 'replaceApprovalType',
		type: 'options',
		required: true,
		default: 'job',
		displayOptions: {
			show: {
				resource: ['approvalFlow'],
				operation: ['replaceApprovers'],
			},
		},
		options: [
			{
				name: 'Job',
				value: 'job',
			},
			{
				name: 'Offer',
				value: 'offer',
			},
		],
		description: 'The type of approval flow to modify',
	},
	{
		displayName: 'Job ID',
		name: 'jobIdForReplace',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['approvalFlow'],
				operation: ['replaceApprovers'],
				replaceApprovalType: ['job'],
			},
		},
		description: 'The ID of the job',
	},
	{
		displayName: 'Offer ID',
		name: 'offerIdForReplace',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['approvalFlow'],
				operation: ['replaceApprovers'],
				replaceApprovalType: ['offer'],
			},
		},
		description: 'The ID of the offer',
	},
	{
		displayName: 'Approval Groups',
		name: 'approvalGroups',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Approval Group',
		default: {},
		displayOptions: {
			show: {
				resource: ['approvalFlow'],
				operation: ['replaceApprovers'],
			},
		},
		options: [
			{
				name: 'group',
				displayName: 'Approval Group',
				values: [
					{
						displayName: 'Approval Type',
						name: 'approval_type',
						type: 'options',
						options: [
							{
								name: 'Required Approval',
								value: 'required_approval',
							},
							{
								name: 'Optional Approval',
								value: 'optional_approval',
							},
						],
						default: 'required_approval',
						description: 'The type of approval required',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'number',
						default: 0,
						description: 'The priority order of this approval group',
					},
					{
						displayName: 'Job Name',
						name: 'job_name',
						type: 'string',
						default: '',
						description: 'Name/label for this approval group',
					},
					{
						displayName: 'Approver User IDs',
						name: 'approver_user_ids',
						type: 'string',
						default: '',
						description: 'Comma-separated list of user IDs who can approve',
					},
				],
			},
		],
		description: 'The approval groups to set for this flow',
	},
];

export async function executeApprovalFlowsOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	if (operation === 'getForJob') {
		const jobId = this.getNodeParameter('jobId', index) as number;
		responseData = await greenhouseApiRequest.call(
			this,
			'GET',
			`/jobs/${jobId}/approval_flows`,
		);
	} else if (operation === 'getForOffer') {
		const offerId = this.getNodeParameter('offerId', index) as number;
		responseData = await greenhouseApiRequest.call(
			this,
			'GET',
			`/offers/${offerId}/approval_flows`,
		);
	} else if (operation === 'requestApprovals') {
		const approvalType = this.getNodeParameter('approvalType', index) as string;

		if (approvalType === 'job') {
			const jobId = this.getNodeParameter('jobIdForApproval', index) as number;
			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/jobs/${jobId}/approval_flows/request_approvals`,
			);
		} else {
			const offerId = this.getNodeParameter('offerIdForApproval', index) as number;
			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/offers/${offerId}/approval_flows/request_approvals`,
			);
		}
	} else if (operation === 'replaceApprovers') {
		const replaceApprovalType = this.getNodeParameter('replaceApprovalType', index) as string;
		const approvalGroupsData = this.getNodeParameter('approvalGroups', index, {}) as {
			group?: Array<{
				approval_type: string;
				priority: number;
				job_name?: string;
				approver_user_ids: string;
			}>;
		};

		const approvalGroups = (approvalGroupsData.group || []).map((group) => ({
			approval_type: group.approval_type,
			priority: group.priority,
			job_name: group.job_name || undefined,
			approvers: group.approver_user_ids
				.split(',')
				.map((id) => parseInt(id.trim(), 10))
				.filter((id) => !isNaN(id))
				.map((userId) => ({ user_id: userId })),
		}));

		if (replaceApprovalType === 'job') {
			const jobId = this.getNodeParameter('jobIdForReplace', index) as number;
			responseData = await greenhouseApiRequest.call(
				this,
				'PUT',
				`/jobs/${jobId}/approval_flows`,
				{ approval_groups: approvalGroups },
			);
		} else {
			const offerId = this.getNodeParameter('offerIdForReplace', index) as number;
			responseData = await greenhouseApiRequest.call(
				this,
				'PUT',
				`/offers/${offerId}/approval_flows`,
				{ approval_groups: approvalGroups },
			);
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
		{ itemData: { item: index } },
	);

	return executionData;
}
