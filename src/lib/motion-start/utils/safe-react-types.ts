/**
 * This file contains some types that mirror those in React.
 * This allows mostly-generic code to use these types without
 * creating a dependency on React. This allows us to easily
 * offer entry points that don't depend on React.
 */

export type MutableRefObject<T> = {
	current: T;
};

export type RefObject<T> = {
	current: T | null;
};

export type RefCallBack<T> = (instance: T | null) => void;

export type Ref<T> = RefCallBack<T> | RefObject<T> | null;
