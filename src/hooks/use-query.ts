import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

export function useQuery<T>(fn: () => Promise<T>, deps: unknown[] = []) {
    const data = useSignal<T | null>(null);
    const loading = useSignal(true);
    const error = useSignal<Error>(null);

    useEffect(() => {
        fn()
            .then((r) => (data.value = r))
            .catch((e) => {
                console.log(e);
                error.value = e;
            })
            .finally(() => {
                loading.value = false;
            });
    }, deps);

    return {
        data,
        loading,
        error,
        isError: () => error.value !== null,
        isLoading: () => loading.value,
        isLoadingOrError: () => loading.value || error.value !== null,
    };
}
