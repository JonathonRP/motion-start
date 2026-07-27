import { createContext } from 'svelte';

export interface MotionOutroContext {
	readonly custom: unknown;
	readonly mode: 'sync' | 'popLayout' | 'wait';
	readonly nonce?: string;
	readonly presenceAffectsLayout: boolean;
	begin: () => (id: string | number, completed?: boolean) => void;
	reserve: (duration: number) => void;
	remaining: () => number;
	waitForExit: () => Promise<void>;
}

const [getMotionOutroContext, setMotionOutroContext] = createContext<MotionOutroContext | null>();

export function useMotionOutroContext() {
	try {
		return getMotionOutroContext();
	} catch {
		return null;
	}
}

export { setMotionOutroContext };
