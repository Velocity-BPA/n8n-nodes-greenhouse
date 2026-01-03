/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { greenhouseApiRequest, greenhouseApiRequestAllItems } from '../../transport';
import { cleanObject, paginationFields } from '../../utils';

export const candidateFields: INodeProperties[] = [
	// Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter candidates created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter candidates created before this date',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Filter by candidate email',
			},
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				default: '',
				description: 'Filter by job ID',
			},
			{
				displayName: 'Updated After',
				name: 'updatedAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter candidates updated after this date',
			},
			{
				displayName: 'Updated Before',
				name: 'updatedBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter candidates updated before this date',
			},
		],
	},
	...paginationFields.map((field) => ({
		...field,
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['getMany'],
			},
		},
	})),

	// Get
	{
		displayName: 'Candidate ID',
		name: 'candidateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['get', 'update', 'delete', 'anonymize', 'addAttachment', 'addNote', 'addEmail', 'getActivityFeed'],
			},
		},
		description: 'The ID of the candidate',
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
				resource: ['candidate'],
				operation: ['create'],
			},
		},
		description: 'The candidate\'s first name',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['create'],
			},
		},
		description: 'The candidate\'s last name',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'The candidate\'s current company',
			},
			{
				displayName: 'Coordinator ID',
				name: 'coordinatorId',
				type: 'string',
				default: '',
				description: 'The ID of the coordinator for this candidate',
			},
			{
				displayName: 'Email Addresses',
				name: 'emailAddresses',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'emails',
						displayName: 'Email',
						values: [
							{
								displayName: 'Email',
								name: 'value',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'Personal', value: 'personal' },
									{ name: 'Work', value: 'work' },
									{ name: 'Other', value: 'other' },
								],
								default: 'personal',
							},
						],
					},
				],
			},
			{
				displayName: 'Is Private',
				name: 'isPrivate',
				type: 'boolean',
				default: false,
				description: 'Whether the candidate is private',
			},
			{
				displayName: 'Phone Numbers',
				name: 'phoneNumbers',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'phones',
						displayName: 'Phone',
						values: [
							{
								displayName: 'Phone Number',
								name: 'value',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'Home', value: 'home' },
									{ name: 'Mobile', value: 'mobile' },
									{ name: 'Work', value: 'work' },
									{ name: 'Other', value: 'other' },
								],
								default: 'mobile',
							},
						],
					},
				],
			},
			{
				displayName: 'Recruiter ID',
				name: 'recruiterId',
				type: 'string',
				default: '',
				description: 'The ID of the recruiter for this candidate',
			},
			{
				displayName: 'Social Media',
				name: 'socialMedia',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'profiles',
						displayName: 'Profile',
						values: [
							{
								displayName: 'URL',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The candidate\'s current title',
			},
			{
				displayName: 'Website Addresses',
				name: 'websiteAddresses',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'websites',
						displayName: 'Website',
						values: [
							{
								displayName: 'URL',
								name: 'value',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'Personal', value: 'personal' },
									{ name: 'Company', value: 'company' },
									{ name: 'Portfolio', value: 'portfolio' },
									{ name: 'Blog', value: 'blog' },
									{ name: 'Other', value: 'other' },
								],
								default: 'personal',
							},
						],
					},
				],
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
				resource: ['candidate'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'The candidate\'s current company',
			},
			{
				displayName: 'Coordinator ID',
				name: 'coordinatorId',
				type: 'string',
				default: '',
				description: 'The ID of the coordinator for this candidate',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'The candidate\'s first name',
			},
			{
				displayName: 'Is Private',
				name: 'isPrivate',
				type: 'boolean',
				default: false,
				description: 'Whether the candidate is private',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'The candidate\'s last name',
			},
			{
				displayName: 'Recruiter ID',
				name: 'recruiterId',
				type: 'string',
				default: '',
				description: 'The ID of the recruiter for this candidate',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The candidate\'s current title',
			},
		],
	},

	// Merge
	{
		displayName: 'Primary Candidate ID',
		name: 'primaryCandidateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['merge'],
			},
		},
		description: 'The ID of the primary candidate (will be kept)',
	},
	{
		displayName: 'Duplicate Candidate ID',
		name: 'duplicateCandidateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['merge'],
			},
		},
		description: 'The ID of the duplicate candidate (will be merged into primary)',
	},

	// Add Attachment
	{
		displayName: 'Attachment Type',
		name: 'attachmentType',
		type: 'options',
		options: [
			{ name: 'Resume', value: 'resume' },
			{ name: 'Cover Letter', value: 'cover_letter' },
			{ name: 'Admin Only', value: 'admin_only' },
		],
		default: 'resume',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['addAttachment'],
			},
		},
		description: 'The type of attachment',
	},
	{
		displayName: 'Filename',
		name: 'filename',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['addAttachment'],
			},
		},
		description: 'The filename of the attachment',
	},
	{
		displayName: 'Content (Base64)',
		name: 'content',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['addAttachment'],
			},
		},
		description: 'The base64-encoded content of the attachment',
	},

	// Add Note
	{
		displayName: 'Note Body',
		name: 'noteBody',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['addNote'],
			},
		},
		description: 'The content of the note',
	},
	{
		displayName: 'Note Options',
		name: 'noteOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['addNote'],
			},
		},
		options: [
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'options',
				options: [
					{ name: 'Admin Only', value: 'admin_only' },
					{ name: 'Private', value: 'private' },
					{ name: 'Public', value: 'public' },
				],
				default: 'public',
				description: 'The visibility of the note',
			},
		],
	},

	// Add Email
	{
		displayName: 'Email Subject',
		name: 'emailSubject',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['addEmail'],
			},
		},
		description: 'The subject of the email',
	},
	{
		displayName: 'Email Body',
		name: 'emailBody',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['addEmail'],
			},
		},
		description: 'The body of the email',
	},
	{
		displayName: 'From Email',
		name: 'fromEmail',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['addEmail'],
			},
		},
		description: 'The email address the email was sent from',
	},
	{
		displayName: 'To Email',
		name: 'toEmail',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['candidate'],
				operation: ['addEmail'],
			},
		},
		description: 'The email address the email was sent to',
	},
];

export async function executeCandidateOperation(
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
			if (filters.jobId) qs.job_id = filters.jobId;
			if (filters.createdAfter) qs.created_after = filters.createdAfter;
			if (filters.createdBefore) qs.created_before = filters.createdBefore;
			if (filters.updatedAfter) qs.updated_after = filters.updatedAfter;
			if (filters.updatedBefore) qs.updated_before = filters.updatedBefore;

			if (returnAll) {
				responseData = await greenhouseApiRequestAllItems.call(
					this,
					'GET',
					'/candidates',
					{},
					qs,
				);
			} else {
				qs.per_page = limit;
				responseData = await greenhouseApiRequest.call(
					this,
					'GET',
					'/candidates',
					{},
					qs,
				);
			}
			break;
		}

		case 'get': {
			const candidateId = this.getNodeParameter('candidateId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/candidates/${candidateId}`,
			);
			break;
		}

		case 'create': {
			const firstName = this.getNodeParameter('firstName', i) as string;
			const lastName = this.getNodeParameter('lastName', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				first_name: firstName,
				last_name: lastName,
			};

			if (additionalFields.title) body.title = additionalFields.title;
			if (additionalFields.company) body.company = additionalFields.company;
			if (additionalFields.isPrivate !== undefined) body.is_private = additionalFields.isPrivate;
			if (additionalFields.recruiterId) body.recruiter_id = Number(additionalFields.recruiterId);
			if (additionalFields.coordinatorId) body.coordinator_id = Number(additionalFields.coordinatorId);

			// Handle email addresses
			if (additionalFields.emailAddresses) {
				const emails = (additionalFields.emailAddresses as IDataObject).emails as IDataObject[];
				if (emails?.length) {
					body.email_addresses = emails;
				}
			}

			// Handle phone numbers
			if (additionalFields.phoneNumbers) {
				const phones = (additionalFields.phoneNumbers as IDataObject).phones as IDataObject[];
				if (phones?.length) {
					body.phone_numbers = phones;
				}
			}

			// Handle social media
			if (additionalFields.socialMedia) {
				const profiles = (additionalFields.socialMedia as IDataObject).profiles as IDataObject[];
				if (profiles?.length) {
					body.social_media_addresses = profiles;
				}
			}

			// Handle websites
			if (additionalFields.websiteAddresses) {
				const websites = (additionalFields.websiteAddresses as IDataObject).websites as IDataObject[];
				if (websites?.length) {
					body.website_addresses = websites;
				}
			}

			// Handle tags
			if (additionalFields.tags) {
				body.tags = (additionalFields.tags as string).split(',').map((t) => t.trim());
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				'/candidates',
				body,
			);
			break;
		}

		case 'update': {
			const candidateId = this.getNodeParameter('candidateId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.firstName) body.first_name = updateFields.firstName;
			if (updateFields.lastName) body.last_name = updateFields.lastName;
			if (updateFields.title) body.title = updateFields.title;
			if (updateFields.company) body.company = updateFields.company;
			if (updateFields.isPrivate !== undefined) body.is_private = updateFields.isPrivate;
			if (updateFields.recruiterId) body.recruiter_id = Number(updateFields.recruiterId);
			if (updateFields.coordinatorId) body.coordinator_id = Number(updateFields.coordinatorId);

			responseData = await greenhouseApiRequest.call(
				this,
				'PATCH',
				`/candidates/${candidateId}`,
				cleanObject(body),
			);
			break;
		}

		case 'delete': {
			const candidateId = this.getNodeParameter('candidateId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'DELETE',
				`/candidates/${candidateId}`,
			);
			responseData = { success: true };
			break;
		}

		case 'anonymize': {
			const candidateId = this.getNodeParameter('candidateId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'PUT',
				`/candidates/${candidateId}/anonymize`,
				{
					fields: [
						'full_name',
						'phone_numbers',
						'emails',
						'social_media_links',
						'websites',
						'addresses',
						'location',
						'custom_candidate_fields',
						'source',
						'recruiter',
						'coordinator',
						'attachments',
						'referral_questions',
						'email_addresses',
						'activity_items',
						'innotes',
					],
				},
			);
			break;
		}

		case 'merge': {
			const primaryCandidateId = this.getNodeParameter('primaryCandidateId', i) as string;
			const duplicateCandidateId = this.getNodeParameter('duplicateCandidateId', i) as string;

			responseData = await greenhouseApiRequest.call(
				this,
				'PUT',
				`/candidates/merge`,
				{
					primary_candidate_id: Number(primaryCandidateId),
					duplicate_candidate_id: Number(duplicateCandidateId),
				},
			);
			break;
		}

		case 'addAttachment': {
			const candidateId = this.getNodeParameter('candidateId', i) as string;
			const attachmentType = this.getNodeParameter('attachmentType', i) as string;
			const filename = this.getNodeParameter('filename', i) as string;
			const content = this.getNodeParameter('content', i) as string;

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/candidates/${candidateId}/attachments`,
				{
					filename,
					type: attachmentType,
					content,
					content_type: 'application/octet-stream',
				},
			);
			break;
		}

		case 'addNote': {
			const candidateId = this.getNodeParameter('candidateId', i) as string;
			const noteBody = this.getNodeParameter('noteBody', i) as string;
			const noteOptions = this.getNodeParameter('noteOptions', i, {}) as IDataObject;

			const body: IDataObject = {
				body: noteBody,
			};

			if (noteOptions.visibility) {
				body.visibility = noteOptions.visibility;
			}

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/candidates/${candidateId}/activity_feed/notes`,
				body,
			);
			break;
		}

		case 'addEmail': {
			const candidateId = this.getNodeParameter('candidateId', i) as string;
			const subject = this.getNodeParameter('emailSubject', i) as string;
			const body = this.getNodeParameter('emailBody', i) as string;
			const from = this.getNodeParameter('fromEmail', i) as string;
			const to = this.getNodeParameter('toEmail', i) as string;

			responseData = await greenhouseApiRequest.call(
				this,
				'POST',
				`/candidates/${candidateId}/activity_feed/emails`,
				{
					subject,
					body,
					from,
					to,
				},
			);
			break;
		}

		case 'getActivityFeed': {
			const candidateId = this.getNodeParameter('candidateId', i) as string;
			responseData = await greenhouseApiRequest.call(
				this,
				'GET',
				`/candidates/${candidateId}/activity_feed`,
			);
			break;
		}
	}

	return responseData;
}
