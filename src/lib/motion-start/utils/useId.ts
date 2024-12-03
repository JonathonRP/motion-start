import { nanoid } from 'nanoid/non-secure';
import { createContext, useContext } from '../context/utils/context.svelte';
import { fromStore } from 'svelte/store';

export const useId = (prefix?: string) => {
	const idContext = createContext<string>(null as any);
	idContext.Provider = prefix ? prefix + nanoid() : nanoid();
	return fromStore(useContext(idContext)).current;
};
