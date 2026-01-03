/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

import { logLicensingNotice } from './utils';

import {
	GREENHOUSE_RESOURCES,
	CANDIDATE_OPERATIONS,
	APPLICATION_OPERATIONS,
	JOB_OPERATIONS,
	JOB_POST_OPERATIONS,
	OFFER_OPERATIONS,
	SCORECARD_OPERATIONS,
	INTERVIEW_OPERATIONS,
	USER_OPERATIONS,
	DEPARTMENT_OPERATIONS,
	OFFICE_OPERATIONS,
	SOURCE_OPERATIONS,
	CUSTOM_FIELD_OPERATIONS,
	TAG_OPERATIONS,
	EEOC_OPERATIONS,
	APPROVAL_FLOW_OPERATIONS,
	JOB_BOARD_OPERATIONS,
} from './constants';

import { candidateFields, executeCandidateOperation } from './actions/candidates';
import { applicationFields, executeApplicationOperation } from './actions/applications';
import { jobFields, executeJobOperation } from './actions/jobs';
import { jobPostFields, executeJobPostOperation } from './actions/jobPosts';
import { offerFields, executeOfferOperation } from './actions/offers';
import { scorecardFields, executeScorecardOperation } from './actions/scorecards';
import { interviewFields, executeInterviewOperation } from './actions/interviews';
import { userFields, executeUserOperation } from './actions/users';
import { departmentsFields, executeDepartmentsOperation } from './actions/departments';
import { officesFields, executeOfficesOperation } from './actions/offices';
import { sourcesFields, executeSourcesOperation } from './actions/sources';
import { customFieldsFields, executeCustomFieldsOperation } from './actions/customFields';
import { tagsFields, executeTagsOperation } from './actions/tags';
import { eeocFields, executeEeocOperation } from './actions/eeoc';
import { approvalFlowsFields, executeApprovalFlowsOperation } from './actions/approvalFlows';
import { jobBoardFields, execute as executeJobBoardOperation } from './actions/jobBoard';

// Log licensing notice once on module load
logLicensingNotice();

export class Greenhouse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Greenhouse',
		name: 'greenhouse',
		icon: 'file:greenhouse.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Greenhouse ATS API',
		defaults: {
			name: 'Greenhouse',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'greenhouseApi',
				required: true,
			},
		],
		properties: [
			GREENHOUSE_RESOURCES,
			// Operations for each resource
			CANDIDATE_OPERATIONS,
			APPLICATION_OPERATIONS,
			JOB_OPERATIONS,
			JOB_POST_OPERATIONS,
			OFFER_OPERATIONS,
			SCORECARD_OPERATIONS,
			INTERVIEW_OPERATIONS,
			USER_OPERATIONS,
			DEPARTMENT_OPERATIONS,
			OFFICE_OPERATIONS,
			SOURCE_OPERATIONS,
			CUSTOM_FIELD_OPERATIONS,
			TAG_OPERATIONS,
			EEOC_OPERATIONS,
			APPROVAL_FLOW_OPERATIONS,
			JOB_BOARD_OPERATIONS,
			// Fields for each resource
			...candidateFields,
			...applicationFields,
			...jobFields,
			...jobPostFields,
			...offerFields,
			...scorecardFields,
			...interviewFields,
			...userFields,
			...departmentsFields,
			...officesFields,
			...sourcesFields,
			...customFieldsFields,
			...tagsFields,
			...eeocFields,
			...approvalFlowsFields,
			...jobBoardFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData: unknown;
				let executionData: INodeExecutionData[];

				switch (resource) {
					case 'candidate':
						responseData = await executeCandidateOperation.call(this, operation, i);
						executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
							{ itemData: { item: i } },
						);
						break;
					case 'application':
						responseData = await executeApplicationOperation.call(this, operation, i);
						executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
							{ itemData: { item: i } },
						);
						break;
					case 'job':
						responseData = await executeJobOperation.call(this, operation, i);
						executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
							{ itemData: { item: i } },
						);
						break;
					case 'jobPost':
						responseData = await executeJobPostOperation.call(this, operation, i);
						executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
							{ itemData: { item: i } },
						);
						break;
					case 'offer':
						responseData = await executeOfferOperation.call(this, operation, i);
						executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
							{ itemData: { item: i } },
						);
						break;
					case 'scorecard':
						responseData = await executeScorecardOperation.call(this, operation, i);
						executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
							{ itemData: { item: i } },
						);
						break;
					case 'interview':
						responseData = await executeInterviewOperation.call(this, operation, i);
						executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
							{ itemData: { item: i } },
						);
						break;
					case 'user':
						responseData = await executeUserOperation.call(this, operation, i);
						executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
							{ itemData: { item: i } },
						);
						break;
					case 'department':
						executionData = await executeDepartmentsOperation.call(this, i);
						break;
					case 'office':
						executionData = await executeOfficesOperation.call(this, i);
						break;
					case 'source':
						executionData = await executeSourcesOperation.call(this, i);
						break;
					case 'customField':
						executionData = await executeCustomFieldsOperation.call(this, i);
						break;
					case 'tag':
						executionData = await executeTagsOperation.call(this, i);
						break;
					case 'eeoc':
						executionData = await executeEeocOperation.call(this, i);
						break;
					case 'approvalFlow':
						executionData = await executeApprovalFlowsOperation.call(this, i);
						break;
					case 'jobBoard':
						responseData = await executeJobBoardOperation.call(this, operation, i);
						executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
							{ itemData: { item: i } },
						);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
