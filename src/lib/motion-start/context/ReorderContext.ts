/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { ReorderContext as ReorderContextProps } from '../components/Reorder/types';
import { createContext } from './create';

interface ReorderContext<T> extends ReorderContextProps<T> {}

export const ReorderContext = createContext<ReorderContext<any> | null>(null);
