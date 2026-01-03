/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';

import {
	greenhouseJobBoardApiRequest,
	greenhouseApiRequest,
} from '../../transport';

import { cleanObject } from '../../utils';

export const jobBoardFields: INodeProperties[] = [
	// ----------------------------------
	//       jobBoard: getBoard
	// ----------------------------------
	{
		displayName: 'Board Token',
		name: 'boardToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['jobBoard'],
				operation: ['getBoard', 'getBoardDepartments', 'getBoardJob', 'getBoardJobs', 'getBoardOffices'],
			},
		},
		description: 'The public job board token',
	},

	// ----------------------------------
	//       jobBoard: getBoardJob
	// ----------------------------------
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['jobBoard'],
				operation: ['getBoardJob'],
			},
		},
		description: 'The ID of the job to retrieve',
	},

	// ----------------------------------
	//       jobBoard: getBoardJobs
	// ----------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['jobBoard'],
				operation: ['getBoardJobs'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'boolean',
				default: false,
				description: 'Whether to include job content (description, pay, etc.)',
			},
			{
				displayName: 'Department ID',
				name: 'departmentId',
				type: 'number',
				default: 0,
				description: 'Filter by department ID',
			},
			{
				displayName: 'Office ID',
				name: 'officeId',
				type: 'number',
				default: 0,
				description: 'Filter by office ID',
			},
		],
	},

	// ----------------------------------
	//       jobBoard: submitApplication
	// ----------------------------------
	{
		displayName: 'Job Post ID',
		name: 'jobPostId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['jobBoard'],
				operation: ['submitApplication'],
			},
		},
		description: 'The ID of the job post to apply to',
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['jobBoard'],
				operation: ['submitApplication'],
			},
		},
		description: 'Candidate first name',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['jobBoard'],
				operation: ['submitApplication'],
			},
		},
		description: 'Candidate last name',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@example.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['jobBoard'],
				operation: ['submitApplication'],
			},
		},
		description: 'Candidate email address',
	},
	{
		displayName: 'Application Fields',
		name: 'applicationFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['jobBoard'],
				operation: ['submitApplication'],
			},
		},
		options: [
			{
				displayName: 'Cover Letter',
				name: 'coverLetter',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Cover letter text',
			},
			{
				displayName: 'LinkedIn Profile URL',
				name: 'linkedinProfileUrl',
				type: 'string',
				default: '',
				description: 'LinkedIn profile URL',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
				description: 'Candidate location',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Candidate phone number',
			},
			{
				displayName: 'Resume Binary Property',
				name: 'resumeBinaryProperty',
				type: 'string',
				default: 'data',
				description: 'Name of the binary property containing the resume file',
			},
			{
				displayName: 'Source ID',
				name: 'sourceId',
				type: 'number',
				default: 0,
				description: 'The ID of the source for this application',
			},
			{
				displayName: 'Website URLs',
				name: 'websiteUrls',
				type: 'string',
				default: '',
				description: 'Comma-separated list of website URLs',
			},
		],
	},
	{
		displayName: 'Custom Questions',
		name: 'customQuestions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['jobBoard'],
				operation: ['submitApplication'],
			},
		},
		options: [
			{
				name: 'questions',
				displayName: 'Questions',
				values: [
					{
						displayName: 'Question ID',
						name: 'id',
						type: 'number',
						default: 0,
						description: 'The ID of the custom question',
					},
					{
						displayName: 'Answer',
						name: 'answer',
						type: 'string',
						default: '',
						description: 'The answer to the question',
					},
				],
			},
		],
		description: 'Answers to custom application questions',
	},
];

export async function execute(
	this: IExecuteFunctions,
	_operation: string,
	index: number,
): Promise<IDataObject | IDataObject[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'listBoards': {
			// List all job boards - uses Harvest API
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				'/job_boards',
			);
			break;
		}

		case 'getBoard': {
			// Get board information - uses Job Board API
			const boardToken = this.getNodeParameter('boardToken', index) as string;
			responseData = await greenhouseJobBoardApiRequest.call(
				this,
				'GET',
				'',
				{},
				{},
				boardToken,
			);
			break;
		}

		case 'getBoardJobs': {
			// Get all jobs on a board
			const boardToken = this.getNodeParameter('boardToken', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const qs: IDataObject = {};
			if (additionalFields.content) {
				qs.content = 'true';
			}
			if (additionalFields.departmentId) {
				qs.department_id = additionalFields.departmentId;
			}
			if (additionalFields.officeId) {
				qs.office_id = additionalFields.officeId;
			}

			responseData = await greenhouseJobBoardApiRequest.call(
				this,
				'GET',
				'/jobs',
				{},
				cleanObject(qs),
				boardToken,
			);
			break;
		}

		case 'getBoardJob': {
			// Get a specific job from the board
			const boardToken = this.getNodeParameter('boardToken', index) as string;
			const jobId = this.getNodeParameter('jobId', index) as number;

			responseData = await greenhouseJobBoardApiRequest.call(
				this,
				'GET',
				`/jobs/${jobId}`,
				{},
				{},
				boardToken,
			);
			break;
		}

		case 'getBoardDepartments': {
			// Get departments on the board
			const boardToken = this.getNodeParameter('boardToken', index) as string;

			responseData = await greenhouseJobBoardApiRequest.call(
				this,
				'GET',
				'/departments',
				{},
				{},
				boardToken,
			);
			break;
		}

		case 'getBoardOffices': {
			// Get offices on the board
			const boardToken = this.getNodeParameter('boardToken', index) as string;

			responseData = await greenhouseJobBoardApiRequest.call(
				this,
				'GET',
				'/offices',
				{},
				{},
				boardToken,
			);
			break;
		}

		case 'submitApplication': {
			// Submit a candidate application
			const jobPostId = this.getNodeParameter('jobPostId', index) as number;
			const firstName = this.getNodeParameter('firstName', index) as string;
			const lastName = this.getNodeParameter('lastName', index) as string;
			const email = this.getNodeParameter('email', index) as string;
			const applicationFields = this.getNodeParameter('applicationFields', index) as IDataObject;
			const customQuestions = this.getNodeParameter('customQuestions', index) as IDataObject;

			const body: IDataObject = {
				id: jobPostId,
				first_name: firstName,
				last_name: lastName,
				email,
			};

			// Add optional fields
			if (applicationFields.phone) {
				body.phone = applicationFields.phone;
			}
			if (applicationFields.location) {
				body.location = applicationFields.location;
			}
			if (applicationFields.coverLetter) {
				body.cover_letter = applicationFields.coverLetter;
			}
			if (applicationFields.linkedinProfileUrl) {
				body.linkedin_profile_url = applicationFields.linkedinProfileUrl;
			}
			if (applicationFields.sourceId) {
				body.source_id = applicationFields.sourceId;
			}
			if (applicationFields.websiteUrls) {
				const urls = (applicationFields.websiteUrls as string).split(',').map(u => u.trim());
				body.website_urls = urls;
			}

			// Handle resume attachment
			if (applicationFields.resumeBinaryProperty) {
				const binaryPropertyName = applicationFields.resumeBinaryProperty as string;
				const binaryData = this.helpers.assertBinaryData(index, binaryPropertyName);
				
				if (binaryData) {
					const dataBuffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);
					body.resume = {
						content: dataBuffer.toString('base64'),
						filename: binaryData.fileName || 'resume.pdf',
					};
				}
			}

			// Add custom question answers
			if (customQuestions.questions) {
				const questions = customQuestions.questions as Array<{ id: number; answer: string }>;
				body.mapped_url_token_answers = questions.map(q => ({
					question_id: q.id,
					answer_text: q.answer,
				}));
			}

			// Use Harvest API for application submission
			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				'/applications',
				body,
			);
			break;
		}
	}

	return responseData;
}
