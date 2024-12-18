import { nanoid } from 'nanoid/non-secure';
import { createContext, useContext } from '../context/utils/context.svelte';
import { fromStore, writable } from 'svelte/store';

const idContext = createContext<() => string>(nanoid);
const context = writable<() => string>(nanoid);

export const useId = (prefix?: string) => {
	let id = fromStore(context).current;
	id = () => (prefix ? prefix + id() : id());
	idContext.Provider = id;
	return fromStore(useContext(idContext)).current;
};
