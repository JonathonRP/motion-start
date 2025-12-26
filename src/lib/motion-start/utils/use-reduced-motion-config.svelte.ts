/**
 * useReducedMotionConfig hook
 * Allows configuration of reduced motion behavior
 * Based on framer-motion v11.11.11
 */

/**
 * Hook to configure reduced motion behavior globally
 *
 * In framer-motion v11, this allows overriding the system preference
 * for reduced motion on a per-component or global basis.
 *
 * @returns A function to set reduced motion preference
 * @public
 */
export function useReducedMotionConfig(): (shouldReduce: boolean) => void {
	return (shouldReduce: boolean) => {
		// Implementation would set global config
		// This is a placeholder for v11.11.11 API compatibility
		console.warn('useReducedMotionConfig: Configuration not yet implemented');
	};
}
