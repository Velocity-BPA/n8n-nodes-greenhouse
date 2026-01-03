/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Greenhouse } from '../../nodes/Greenhouse/Greenhouse.node';
import { GreenhouseTrigger } from '../../nodes/Greenhouse/GreenhouseTrigger.node';

describe('Greenhouse Node', () => {
	let greenhouse: Greenhouse;

	beforeEach(() => {
		greenhouse = new Greenhouse();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(greenhouse.description.displayName).toBe('Greenhouse');
		});

		it('should have correct node name', () => {
			expect(greenhouse.description.name).toBe('greenhouse');
		});

		it('should have correct credentials', () => {
			expect(greenhouse.description.credentials).toEqual([
				{ name: 'greenhouseApi', required: true },
			]);
		});

		it('should have 16 resources', () => {
			const resourceProperty = greenhouse.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.type).toBe('options');
			if (resourceProperty?.type === 'options' && resourceProperty.options) {
				expect(resourceProperty.options.length).toBe(16);
			}
		});

		it('should include all expected resources', () => {
			const resourceProperty = greenhouse.description.properties.find(
				(p) => p.name === 'resource'
			);
			const resourceValues = (resourceProperty?.options as Array<{ value: string }>)?.map(
				(o) => o.value
			);

			expect(resourceValues).toContain('candidate');
			expect(resourceValues).toContain('application');
			expect(resourceValues).toContain('job');
			expect(resourceValues).toContain('jobPost');
			expect(resourceValues).toContain('offer');
			expect(resourceValues).toContain('scorecard');
			expect(resourceValues).toContain('interview');
			expect(resourceValues).toContain('user');
			expect(resourceValues).toContain('department');
			expect(resourceValues).toContain('office');
			expect(resourceValues).toContain('source');
			expect(resourceValues).toContain('customField');
			expect(resourceValues).toContain('tag');
			expect(resourceValues).toContain('eeoc');
			expect(resourceValues).toContain('approvalFlow');
			expect(resourceValues).toContain('jobBoard');
		});
	});

	describe('Node Properties', () => {
		it('should have icon defined', () => {
			expect(greenhouse.description.icon).toBe('file:greenhouse.svg');
		});

		it('should have inputs and outputs', () => {
			expect(greenhouse.description.inputs).toEqual(['main']);
			expect(greenhouse.description.outputs).toEqual(['main']);
		});

		it('should have version 1', () => {
			expect(greenhouse.description.version).toBe(1);
		});
	});
});

describe('Greenhouse Trigger Node', () => {
	let trigger: GreenhouseTrigger;

	beforeEach(() => {
		trigger = new GreenhouseTrigger();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(trigger.description.displayName).toBe('Greenhouse Trigger');
		});

		it('should have correct node name', () => {
			expect(trigger.description.name).toBe('greenhouseTrigger');
		});

		it('should be in trigger group', () => {
			expect(trigger.description.group).toContain('trigger');
		});

		it('should have webhook configuration', () => {
			expect(trigger.description.webhooks).toBeDefined();
			expect(trigger.description.webhooks?.length).toBe(1);
			expect(trigger.description.webhooks?.[0].httpMethod).toBe('POST');
		});
	});

	describe('Webhook Events', () => {
		it('should have events property', () => {
			const eventsProperty = trigger.description.properties.find(
				(p) => p.name === 'events'
			);
			expect(eventsProperty).toBeDefined();
			expect(eventsProperty?.type).toBe('multiOptions');
		});

		it('should include expected events', () => {
			const eventsProperty = trigger.description.properties.find(
				(p) => p.name === 'events'
			);
			const eventValues = (eventsProperty?.options as Array<{ value: string }>)?.map(
				(o) => o.value
			);

			expect(eventValues).toContain('candidate_created');
			expect(eventValues).toContain('candidate_hired');
			expect(eventValues).toContain('application_created');
			expect(eventValues).toContain('offer_created');
			expect(eventValues).toContain('scorecard_submitted');
		});
	});

	describe('Webhook Methods', () => {
		it('should have webhook methods defined', () => {
			expect(trigger.webhookMethods).toBeDefined();
			expect(trigger.webhookMethods.default).toBeDefined();
		});
	});
});
