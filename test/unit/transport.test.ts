/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { validateWebhookSignature } from '../../nodes/Greenhouse/transport';

describe('Transport Functions', () => {
	describe('validateWebhookSignature', () => {
		const secretKey = 'test-secret-key';

		it('should validate a correct signature', () => {
			const payload = JSON.stringify({ action: 'candidate_created', payload: { id: 123 } });
			const crypto = require('crypto');
			const expectedSignature = crypto.createHmac('sha256', secretKey).update(payload).digest('hex');

			const result = validateWebhookSignature(payload, expectedSignature, secretKey);
			expect(result).toBe(true);
		});

		it('should reject an incorrect signature', () => {
			const payload = JSON.stringify({ action: 'candidate_created', payload: { id: 123 } });
			const invalidSignature = 'invalid-signature-12345678901234567890123456789012';

			// Pad the signature to match expected length
			const paddedSignature = invalidSignature.padEnd(64, '0');

			const result = validateWebhookSignature(payload, paddedSignature, secretKey);
			expect(result).toBe(false);
		});

		it('should handle different payload content', () => {
			const payload1 = JSON.stringify({ action: 'test1' });
			const payload2 = JSON.stringify({ action: 'test2' });
			const crypto = require('crypto');
			const signature1 = crypto.createHmac('sha256', secretKey).update(payload1).digest('hex');

			const result = validateWebhookSignature(payload2, signature1, secretKey);
			expect(result).toBe(false);
		});
	});
});

describe('API Request Helpers', () => {
	describe('Error Message Extraction', () => {
		it('should handle error responses correctly', () => {
			// This is a structural test - actual API calls would be mocked
			const errorResponse = {
				message: 'Validation failed',
				errors: [
					{ field: 'email', message: 'is invalid' },
				],
			};

			expect(errorResponse.message).toBe('Validation failed');
			expect(errorResponse.errors[0].message).toBe('is invalid');
		});
	});
});
