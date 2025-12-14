import { type MutableRefObject } from "./safe-react-types";

export function ref<T>(value: T): MutableRefObject<T> {
    let current = $state(value);
    return {
        get current() {
            return current;
        },
        set current(newValue: T) {
            current = newValue;
        },
    };
}