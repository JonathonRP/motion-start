import type { HTMLMotionProps } from './index.js';

describe('public entry type surface', () => {
	it('exports HTMLMotionProps so consumers can type wrapper components', () => {
		type ButtonWrapperProps = HTMLMotionProps<'button'> & { label: string };

		assertType<ButtonWrapperProps>({
			label: 'Save',
			type: 'submit',
			animate: { opacity: 1 },
			whileHover: { scale: 1.1 },
		});
	});
});
