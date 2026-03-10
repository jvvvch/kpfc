import type { FunctionalComponent } from 'preact';
import type { ChildrenProps } from '@/types';

type ComposeProvidersProps = {
    providers: FunctionalComponent<ChildrenProps>[];
} & ChildrenProps;

export function ComposeProviders({
    providers,
    children,
}: ComposeProvidersProps) {
    return (
        <>
            {providers.reduceRight((acc, provider) => {
                return provider({ children: acc });
            }, children)}
        </>
    );
}
