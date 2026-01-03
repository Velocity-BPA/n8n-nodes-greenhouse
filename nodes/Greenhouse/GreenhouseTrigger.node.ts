/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IHookFunctions,
	IDataObject,
} from 'n8n-workflow';

import { validateWebhookSignature } from './transport';
import { logLicensingNotice } from './utils';

// Log licensing notice once on module load
logLicensingNotice();

export class GreenhouseTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Greenhouse Trigger',
		name: 'greenhouseTrigger',
		icon: 'file:greenhouse.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Handle Greenhouse webhook events',
		defaults: {
			name: 'Greenhouse Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'greenhouseApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				options: [
					{
						name: 'Application Created',
						value: 'application_created',
						description: 'Triggered when a new application is created',
					},
					{
						name: 'Application Updated',
						value: 'application_updated',
						description: 'Triggered when an application is updated',
					},
					{
						name: 'Candidate Created',
						value: 'candidate_created',
						description: 'Triggered when a new candidate is created',
					},
					{
						name: 'Candidate Hired',
						value: 'candidate_hired',
						description: 'Triggered when a candidate is hired',
					},
					{
						name: 'Candidate Merged',
						value: 'candidate_merged',
						description: 'Triggered when candidates are merged',
					},
					{
						name: 'Candidate Stage Changed',
						value: 'candidate_stage_change',
						description: 'Triggered when a candidate moves to a new stage',
					},
					{
						name: 'Interview Scheduled',
						value: 'interview_scheduled',
						description: 'Triggered when an interview is scheduled',
					},
					{
						name: 'Job Created',
						value: 'job_created',
						description: 'Triggered when a new job is created',
					},
					{
						name: 'Job Updated',
						value: 'job_updated',
						description: 'Triggered when a job is updated',
					},
					{
						name: 'Offer Created',
						value: 'offer_created',
						description: 'Triggered when an offer is created',
					},
					{
						name: 'Offer Updated',
						value: 'offer_updated',
						description: 'Triggered when an offer is updated',
					},
					{
						name: 'Prospect Created',
						value: 'prospect_created',
						description: 'Triggered when a prospect is created',
					},
					{
						name: 'Rejection Sent',
						value: 'rejection_sent',
						description: 'Triggered when a rejection email is sent',
					},
					{
						name: 'Scorecard Submitted',
						value: 'scorecard_submitted',
						description: 'Triggered when a scorecard is submitted',
					},
				],
				description: 'The events to listen for',
			},
			{
				displayName: 'Secret Key',
				name: 'secretKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'The secret key used to verify webhook signatures (optional but recommended)',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: true,
						description: 'Whether to verify the webhook signature (requires secret key)',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Greenhouse webhooks are configured externally
				// This just returns true to indicate the webhook can receive data
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Greenhouse webhooks must be configured in the Greenhouse dashboard
				// We just return true here - users need to configure webhooks manually
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Greenhouse webhooks are managed externally
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const events = this.getNodeParameter('events') as string[];
		const secretKey = this.getNodeParameter('secretKey') as string;
		const options = this.getNodeParameter('options') as IDataObject;

		// Get the event action from the payload
		const eventAction = body.action as string;

		// Check if this event is one we're listening for
		if (!events.includes(eventAction)) {
			return {
				noWebhookResponse: true,
			};
		}

		// Verify signature if enabled and secret key is provided
		if (options.verifySignature !== false && secretKey) {
			const signature = req.headers['signature'] as string;
			
			if (!signature) {
				return {
					noWebhookResponse: true,
				};
			}

			const rawBody = JSON.stringify(body);
			const isValid = validateWebhookSignature(rawBody, signature, secretKey);

			if (!isValid) {
				return {
					noWebhookResponse: true,
				};
			}
		}

		// Extract the payload data
		const payload = body.payload as IDataObject || body;

		return {
			workflowData: [
				this.helpers.returnJsonArray({
					event: eventAction,
					timestamp: new Date().toISOString(),
					data: payload,
					raw: body,
				}),
			],
		};
	}
}
