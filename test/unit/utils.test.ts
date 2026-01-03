/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	cleanObject,
	snakeToCamel,
	camelToSnake,
	parseCustomFields,
	formatDate,
	parseBoolean,
	buildQueryString,
	getMimeType,
	isValidEmail,
	parseEmailAddresses,
} from '../../nodes/Greenhouse/utils';

describe('Utility Functions', () => {
	describe('cleanObject', () => {
		it('should remove undefined values', () => {
			const input = { a: 1, b: undefined, c: 'test' };
			const result = cleanObject(input);
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should remove null values', () => {
			const input = { a: 1, b: null, c: 'test' };
			const result = cleanObject(input);
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should remove empty strings', () => {
			const input = { a: 1, b: '', c: 'test' };
			const result = cleanObject(input);
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should keep zero values', () => {
			const input = { a: 0, b: 'test' };
			const result = cleanObject(input);
			expect(result).toEqual({ a: 0, b: 'test' });
		});

		it('should keep false boolean values', () => {
			const input = { a: false, b: 'test' };
			const result = cleanObject(input);
			expect(result).toEqual({ a: false, b: 'test' });
		});
	});

	describe('snakeToCamel', () => {
		it('should convert snake_case to camelCase', () => {
			expect(snakeToCamel('hello_world')).toBe('helloWorld');
			expect(snakeToCamel('first_name')).toBe('firstName');
			expect(snakeToCamel('created_at')).toBe('createdAt');
		});

		it('should handle single words', () => {
			expect(snakeToCamel('hello')).toBe('hello');
		});

		it('should handle multiple underscores', () => {
			expect(snakeToCamel('this_is_a_test')).toBe('thisIsATest');
		});
	});

	describe('camelToSnake', () => {
		it('should convert camelCase to snake_case', () => {
			expect(camelToSnake('helloWorld')).toBe('hello_world');
			expect(camelToSnake('firstName')).toBe('first_name');
			expect(camelToSnake('createdAt')).toBe('created_at');
		});

		it('should handle single words', () => {
			expect(camelToSnake('hello')).toBe('hello');
		});

		it('should handle multiple capitals', () => {
			expect(camelToSnake('thisIsATest')).toBe('this_is_a_test');
		});
	});

	describe('parseCustomFields', () => {
		it('should parse custom fields with id', () => {
			const input = [{ id: 1, value: 'test' }];
			const result = parseCustomFields(input);
			expect(result).toEqual([{ id: 1, value: 'test' }]);
		});

		it('should parse custom fields with customFieldId', () => {
			const input = [{ customFieldId: 2, value: 'test' }];
			const result = parseCustomFields(input);
			expect(result).toEqual([{ id: 2, value: 'test' }]);
		});
	});

	describe('formatDate', () => {
		it('should format string dates', () => {
			const result = formatDate('2024-01-15');
			expect(result).toMatch(/2024-01-15/);
		});

		it('should format Date objects', () => {
			const date = new Date('2024-01-15T12:00:00Z');
			const result = formatDate(date);
			expect(result).toBe('2024-01-15T12:00:00.000Z');
		});
	});

	describe('parseBoolean', () => {
		it('should return true for true boolean', () => {
			expect(parseBoolean(true)).toBe(true);
		});

		it('should return false for false boolean', () => {
			expect(parseBoolean(false)).toBe(false);
		});

		it('should return true for "true" string', () => {
			expect(parseBoolean('true')).toBe(true);
			expect(parseBoolean('TRUE')).toBe(true);
		});

		it('should return false for "false" string', () => {
			expect(parseBoolean('false')).toBe(false);
		});

		it('should return true for "1" string', () => {
			expect(parseBoolean('1')).toBe(true);
		});

		it('should handle numbers', () => {
			expect(parseBoolean(1)).toBe(true);
			expect(parseBoolean(0)).toBe(false);
		});
	});

	describe('buildQueryString', () => {
		it('should convert camelCase keys to snake_case', () => {
			const input = { firstName: 'John', lastName: 'Doe' };
			const result = buildQueryString(input);
			expect(result).toEqual({ first_name: 'John', last_name: 'Doe' });
		});

		it('should filter out undefined and null values', () => {
			const input = { name: 'test', value: undefined, other: null };
			const result = buildQueryString(input);
			expect(result).toEqual({ name: 'test' });
		});
	});

	describe('getMimeType', () => {
		it('should return correct MIME type for PDF', () => {
			expect(getMimeType('resume.pdf')).toBe('application/pdf');
		});

		it('should return correct MIME type for DOCX', () => {
			expect(getMimeType('resume.docx')).toBe(
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			);
		});

		it('should return correct MIME type for images', () => {
			expect(getMimeType('photo.jpg')).toBe('image/jpeg');
			expect(getMimeType('photo.png')).toBe('image/png');
		});

		it('should return application/octet-stream for unknown types', () => {
			expect(getMimeType('file.xyz')).toBe('application/octet-stream');
		});
	});

	describe('isValidEmail', () => {
		it('should validate correct email addresses', () => {
			expect(isValidEmail('test@example.com')).toBe(true);
			expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
		});

		it('should reject invalid email addresses', () => {
			expect(isValidEmail('invalid')).toBe(false);
			expect(isValidEmail('no@domain')).toBe(false);
			expect(isValidEmail('@nodomain.com')).toBe(false);
		});
	});

	describe('parseEmailAddresses', () => {
		it('should parse comma-separated emails', () => {
			const result = parseEmailAddresses('a@b.com, c@d.com, e@f.com');
			expect(result).toEqual(['a@b.com', 'c@d.com', 'e@f.com']);
		});

		it('should filter out invalid emails', () => {
			const result = parseEmailAddresses('a@b.com, invalid, c@d.com');
			expect(result).toEqual(['a@b.com', 'c@d.com']);
		});

		it('should handle whitespace', () => {
			const result = parseEmailAddresses('  a@b.com  ,  c@d.com  ');
			expect(result).toEqual(['a@b.com', 'c@d.com']);
		});
	});
});
