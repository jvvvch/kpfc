import { Page } from '@/components/feature';
import { useLocale } from '@/contexts';

export function HomePage() {
    const { locale } = useLocale();

    return (
        <Page>
            <div className="flex h-full w-full items-center justify-center font-semibold text-muted-foreground animate-in fade-in duration-400">
                {locale.common.greeting}
            </div>
        </Page>
    );
}
