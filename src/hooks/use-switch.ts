import { useSignal } from '@preact/signals';

export const useSwitch = <T>(value: T | null) => {
    const remembered = useSignal(value);
    return {
        onSwitch(current: T | null) {
            if (current !== null) {
                remembered.value = current;
                return null;
            }
            return remembered.value;
        },
    };
};
