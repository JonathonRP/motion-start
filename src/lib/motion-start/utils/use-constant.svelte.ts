/**
 * useConstant utility - Svelte 5 adaptation
 * Based on framer-motion@11.11.11
 *
 * Creates a constant value over the lifecycle of a component.
 *
 * In Svelte, this pattern is different from React since Svelte's
 * script blocks only run once per component instance. However,
 * this utility is provided for API compatibility and for use in
 * custom hooks that might need guaranteed single initialization.
 */

type Init<T> = () => T;

/**
 * Creates a constant value over the lifecycle of a component.
 *
 * In Svelte, component scripts run only once per instance, so typically
 * you can just use a regular variable. This utility is provided for:
 * - API compatibility with framer-motion
 * - Use in custom hooks that need guaranteed single initialization
 * - Consistency with the framer-motion codebase patterns
 *
 * @param init - Function that returns the initial value
 * @returns The constant value
 */
export function useConstant<T>(init: Init<T>): T {
    // In Svelte, since component scripts run once per instance,
    // we can simply call the init function and return its result.
    // The calling code will store this in a variable that persists
    // for the component lifetime due to Svelte's execution model.
    return init();
}
