/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const GREENHOUSE_RESOURCES: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Application',
			value: 'application',
			description: 'Manage job applications',
		},
		{
			name: 'Approval Flow',
			value: 'approvalFlow',
			description: 'Manage approval workflows',
		},
		{
			name: 'Candidate',
			value: 'candidate',
			description: 'Manage candidates',
		},
		{
			name: 'Custom Field',
			value: 'customField',
			description: 'Manage custom fields',
		},
		{
			name: 'Department',
			value: 'department',
			description: 'Manage departments',
		},
		{
			name: 'EEOC',
			value: 'eeoc',
			description: 'Access EEOC data',
		},
		{
			name: 'Interview',
			value: 'interview',
			description: 'Manage scheduled interviews',
		},
		{
			name: 'Job',
			value: 'job',
			description: 'Manage jobs and openings',
		},
		{
			name: 'Job Board',
			value: 'jobBoard',
			description: 'Public job board operations',
		},
		{
			name: 'Job Post',
			value: 'jobPost',
			description: 'Manage job posts',
		},
		{
			name: 'Offer',
			value: 'offer',
			description: 'Manage job offers',
		},
		{
			name: 'Office',
			value: 'office',
			description: 'Manage offices',
		},
		{
			name: 'Scorecard',
			value: 'scorecard',
			description: 'Manage interview scorecards',
		},
		{
			name: 'Source',
			value: 'source',
			description: 'Manage candidate sources',
		},
		{
			name: 'Tag',
			value: 'tag',
			description: 'Manage candidate and application tags',
		},
		{
			name: 'User',
			value: 'user',
			description: 'Manage users',
		},
	],
	default: 'candidate',
};

// Candidate Operations
export const CANDIDATE_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['candidate'],
		},
	},
	options: [
		{
			name: 'Add Attachment',
			value: 'addAttachment',
			description: 'Add an attachment to a candidate',
			action: 'Add attachment to a candidate',
		},
		{
			name: 'Add Email',
			value: 'addEmail',
			description: 'Log an email to candidate activity',
			action: 'Add email to a candidate',
		},
		{
			name: 'Add Note',
			value: 'addNote',
			description: 'Add a note to a candidate',
			action: 'Add note to a candidate',
		},
		{
			name: 'Anonymize',
			value: 'anonymize',
			description: 'Anonymize candidate data (GDPR)',
			action: 'Anonymize a candidate',
		},
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new candidate',
			action: 'Create a candidate',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a candidate',
			action: 'Delete a candidate',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a candidate by ID',
			action: 'Get a candidate',
		},
		{
			name: 'Get Activity Feed',
			value: 'getActivityFeed',
			description: 'Get the activity feed for a candidate',
			action: 'Get activity feed for a candidate',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get many candidates',
			action: 'Get many candidates',
		},
		{
			name: 'Merge',
			value: 'merge',
			description: 'Merge duplicate candidates',
			action: 'Merge candidates',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a candidate',
			action: 'Update a candidate',
		},
	],
	default: 'getMany',
};

// Application Operations
export const APPLICATION_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['application'],
		},
	},
	options: [
		{
			name: 'Advance',
			value: 'advance',
			description: 'Advance application to next stage',
			action: 'Advance an application',
		},
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new application for a candidate',
			action: 'Create an application',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete an application',
			action: 'Delete an application',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get an application by ID',
			action: 'Get an application',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get many applications',
			action: 'Get many applications',
		},
		{
			name: 'Hire',
			value: 'hire',
			description: 'Hire a candidate',
			action: 'Hire an application',
		},
		{
			name: 'Move',
			value: 'move',
			description: 'Move application to a specific stage',
			action: 'Move an application',
		},
		{
			name: 'Reject',
			value: 'reject',
			description: 'Reject an application',
			action: 'Reject an application',
		},
		{
			name: 'Transfer',
			value: 'transfer',
			description: 'Transfer application to a different job',
			action: 'Transfer an application',
		},
		{
			name: 'Unreject',
			value: 'unreject',
			description: 'Unreject an application',
			action: 'Unreject an application',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update an application',
			action: 'Update an application',
		},
	],
	default: 'getMany',
};

// Job Operations
export const JOB_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['job'],
		},
	},
	options: [
		{
			name: 'Close Opening',
			value: 'closeOpening',
			description: 'Close a job opening',
			action: 'Close a job opening',
		},
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new job',
			action: 'Create a job',
		},
		{
			name: 'Create Opening',
			value: 'createOpening',
			description: 'Create a new job opening',
			action: 'Create a job opening',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a job by ID',
			action: 'Get a job',
		},
		{
			name: 'Get Hiring Team',
			value: 'getHiringTeam',
			description: 'Get the hiring team for a job',
			action: 'Get hiring team for a job',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get many jobs',
			action: 'Get many jobs',
		},
		{
			name: 'Get Openings',
			value: 'getOpenings',
			description: 'Get job openings',
			action: 'Get job openings',
		},
		{
			name: 'Get Stages',
			value: 'getStages',
			description: 'Get job stages',
			action: 'Get job stages',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a job',
			action: 'Update a job',
		},
		{
			name: 'Update Opening',
			value: 'updateOpening',
			description: 'Update a job opening',
			action: 'Update a job opening',
		},
	],
	default: 'getMany',
};

// Job Post Operations
export const JOB_POST_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['jobPost'],
		},
	},
	options: [
		{
			name: 'Get',
			value: 'get',
			description: 'Get a job post by ID',
			action: 'Get a job post',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get job posts for a job',
			action: 'Get many job posts',
		},
		{
			name: 'Get Questions',
			value: 'getQuestions',
			description: 'Get application questions for a job post',
			action: 'Get job post questions',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a job post',
			action: 'Update a job post',
		},
	],
	default: 'getMany',
};

// Offer Operations
export const OFFER_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['offer'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create an offer for an application',
			action: 'Create an offer',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get an offer by ID',
			action: 'Get an offer',
		},
		{
			name: 'Get Current',
			value: 'getCurrent',
			description: 'Get the current offer for an application',
			action: 'Get current offer',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get many offers',
			action: 'Get many offers',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update an offer',
			action: 'Update an offer',
		},
	],
	default: 'getMany',
};

// Scorecard Operations
export const SCORECARD_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['scorecard'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a scorecard for an interview',
			action: 'Create a scorecard',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a scorecard by ID',
			action: 'Get a scorecard',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get many scorecards',
			action: 'Get many scorecards',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a scorecard',
			action: 'Update a scorecard',
		},
	],
	default: 'getMany',
};

// Interview Operations
export const INTERVIEW_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['interview'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Schedule a new interview',
			action: 'Create an interview',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Cancel an interview',
			action: 'Delete an interview',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get an interview by ID',
			action: 'Get an interview',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get many scheduled interviews',
			action: 'Get many interviews',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update an interview',
			action: 'Update an interview',
		},
	],
	default: 'getMany',
};

// User Operations
export const USER_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['user'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new user',
			action: 'Create a user',
		},
		{
			name: 'Disable',
			value: 'disable',
			description: 'Disable a user',
			action: 'Disable a user',
		},
		{
			name: 'Enable',
			value: 'enable',
			description: 'Enable a user',
			action: 'Enable a user',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a user by ID',
			action: 'Get a user',
		},
		{
			name: 'Get Current',
			value: 'getCurrent',
			description: 'Get the current authenticated user',
			action: 'Get current user',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get many users',
			action: 'Get many users',
		},
		{
			name: 'Update Permissions',
			value: 'updatePermissions',
			description: 'Update user permissions',
			action: 'Update user permissions',
		},
	],
	default: 'getMany',
};

// Department Operations
export const DEPARTMENT_OPERATIONS: INodeProperties = {
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
};

// Office Operations
export const OFFICE_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['office'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new office',
			action: 'Create an office',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get an office by ID',
			action: 'Get an office',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get many offices',
			action: 'Get many offices',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update an office',
			action: 'Update an office',
		},
	],
	default: 'getMany',
};

// Source Operations
export const SOURCE_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['source'],
		},
	},
	options: [
		{
			name: 'Get',
			value: 'get',
			description: 'Get a source by ID',
			action: 'Get a source',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get all sources',
			action: 'Get many sources',
		},
	],
	default: 'getMany',
};

// Custom Field Operations
export const CUSTOM_FIELD_OPERATIONS: INodeProperties = {
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
			action: 'Create custom field options',
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
			description: 'Get custom fields by type',
			action: 'Get many custom fields',
		},
	],
	default: 'getMany',
};

// Tag Operations
export const TAG_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['tag'],
		},
	},
	options: [
		{
			name: 'Add to Candidate',
			value: 'addToCandidate',
			description: 'Add a tag to a candidate',
			action: 'Add tag to candidate',
		},
		{
			name: 'Delete From Candidate',
			value: 'deleteFromCandidate',
			description: 'Remove a tag from a candidate',
			action: 'Delete tag from candidate',
		},
		{
			name: 'Get Application Tags',
			value: 'getApplicationTags',
			description: 'List all application tags',
			action: 'Get application tags',
		},
		{
			name: 'Get Candidate Tags',
			value: 'getCandidateTags',
			description: 'List all candidate tags',
			action: 'Get candidate tags',
		},
	],
	default: 'getCandidateTags',
};

// EEOC Operations
export const EEOC_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['eeoc'],
		},
	},
	options: [
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get EEOC data for applications',
			action: 'Get EEOC data',
		},
	],
	default: 'getMany',
};

// Approval Flow Operations
export const APPROVAL_FLOW_OPERATIONS: INodeProperties = {
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
			name: 'Create',
			value: 'create',
			description: 'Create an approval flow',
			action: 'Create approval flow',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get an approval flow for a job or offer',
			action: 'Get approval flow',
		},
		{
			name: 'Request Approval',
			value: 'requestApproval',
			description: 'Request approval',
			action: 'Request approval',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update an approval flow',
			action: 'Update approval flow',
		},
	],
	default: 'get',
};

// Job Board Operations
export const JOB_BOARD_OPERATIONS: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['jobBoard'],
		},
	},
	options: [
		{
			name: 'Get Board',
			value: 'getBoard',
			description: 'Get board information',
			action: 'Get board',
		},
		{
			name: 'Get Board Departments',
			value: 'getBoardDepartments',
			description: 'List departments on the board',
			action: 'Get board departments',
		},
		{
			name: 'Get Board Job',
			value: 'getBoardJob',
			description: 'Get a job from the board',
			action: 'Get board job',
		},
		{
			name: 'Get Board Jobs',
			value: 'getBoardJobs',
			description: 'List all jobs on the board',
			action: 'Get board jobs',
		},
		{
			name: 'Get Board Offices',
			value: 'getBoardOffices',
			description: 'List offices on the board',
			action: 'Get board offices',
		},
		{
			name: 'List Boards',
			value: 'listBoards',
			description: 'List all job boards',
			action: 'List boards',
		},
		{
			name: 'Submit Application',
			value: 'submitApplication',
			description: 'Submit a candidate application',
			action: 'Submit application',
		},
	],
	default: 'getBoardJobs',
};
