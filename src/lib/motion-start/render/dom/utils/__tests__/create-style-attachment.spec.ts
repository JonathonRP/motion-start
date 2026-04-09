import { motionValue } from '../../../../value';
import { createStyleAttachment } from '../create-style-attachment';

describe('createStyleAttachment', () => {
	test('applies plain styles without taking ownership of MotionValue-managed keys', () => {
		const element = document.createElement('div');
		element.style.width = '10px';

		const cleanup =
			createStyleAttachment({
				position: 'absolute',
				backgroundColor: 'red',
				width: motionValue('20px'),
				'--progress': 0.5,
			})(element) ?? (() => {});

		expect(element.style.position).toBe('absolute');
		expect(element.style.backgroundColor).toBe('red');
		expect(element.style.width).toBe('10px');
		expect(element.style.getPropertyValue('--progress')).toBe('0.5');

		cleanup();

		expect(element.style.position).toBe('');
		expect(element.style.backgroundColor).toBe('');
		expect(element.style.width).toBe('10px');
		expect(element.style.getPropertyValue('--progress')).toBe('');
	});
});
