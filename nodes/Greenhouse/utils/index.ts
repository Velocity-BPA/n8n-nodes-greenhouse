/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeProperties } from 'n8n-workflow';

/**
 * Log licensing notice (once per node load)
 */
let licensingNoticeLogged = false;

export function logLicensingNotice(): void {
	if (!licensingNoticeLogged) {
		console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
		licensingNoticeLogged = true;
	}
}

/**
 * Removes undefined and null values from an object
 */
export function cleanObject(obj: IDataObject): IDataObject {
	const cleaned: IDataObject = {};
	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null && value !== '') {
			cleaned[key] = value;
		}
	}
	return cleaned;
}

/**
 * Converts a snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts a camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Parses custom fields from the n8n UI format
 */
export function parseCustomFields(customFields: IDataObject[]): IDataObject[] {
	return customFields.map((field) => ({
		id: field.id || field.customFieldId,
		value: field.value,
	}));
}

/**
 * Format date to ISO string
 */
export function formatDate(date: string | Date): string {
	if (typeof date === 'string') {
		return new Date(date).toISOString();
	}
	return date.toISOString();
}

/**
 * Parse boolean values from various formats
 */
export function parseBoolean(value: unknown): boolean {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'string') {
		return value.toLowerCase() === 'true' || value === '1';
	}
	if (typeof value === 'number') return value !== 0;
	return false;
}

/**
 * Common pagination fields for list operations
 */
export const paginationFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				returnAll: [false],
			},
		},
	},
];

/**
 * Build query string from options
 */
export function buildQueryString(options: IDataObject): IDataObject {
	const qs: IDataObject = {};

	for (const [key, value] of Object.entries(options)) {
		if (value !== undefined && value !== null && value !== '') {
			// Convert camelCase to snake_case for API
			const apiKey = camelToSnake(key);
			qs[apiKey] = value;
		}
	}

	return qs;
}

/**
 * Extract attachment data for upload
 */
export function prepareAttachmentData(
	filename: string,
	content: Buffer | string,
	type: string,
	visibility: string = 'public',
): IDataObject {
	const base64Content = Buffer.isBuffer(content)
		? content.toString('base64')
		: Buffer.from(content).toString('base64');

	return {
		filename,
		type,
		content: base64Content,
		content_type: getMimeType(filename),
		visibility,
	};
}

/**
 * Get MIME type from filename
 */
export function getMimeType(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase();
	const mimeTypes: Record<string, string> = {
		pdf: 'application/pdf',
		doc: 'application/msword',
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		txt: 'text/plain',
		png: 'image/png',
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		gif: 'image/gif',
	};
	return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Parse email addresses from comma-separated string
 */
export function parseEmailAddresses(emails: string): string[] {
	return emails
		.split(',')
		.map((email) => email.trim())
		.filter((email) => isValidEmail(email));
}
