import { type Signal, useComputed, useSignal } from '@preact/signals';
import type { TargetedEvent } from 'preact';
import { useLocation } from 'preact-iso';
import { Header, IconButton, List, PrimaryButton } from '@/components/atomic';
import {
    BottomGroup,
    FeatureItem,
    HeaderActions,
    HeaderGroup,
    Page,
    ScrollableContent,
    Search,
} from '@/components/feature';
import { useLocale, useMealDraft } from '@/contexts';
import type { Product } from '@/domain/entities';
import { ProductQueries } from '@/domain/queries/product';
import { useQuery } from '@/hooks';

function HeaderSection() {
    const { locale } = useLocale();
    const draft = useMealDraft();

    return (
        <HeaderGroup>
            <HeaderActions>
                {draft.isActive() && (
                    <IconButton.ChevronLeft
                        onClick={() => window.history.back()}
                    />
                )}
            </HeaderActions>
            <Header>
                {draft.isActive()
                    ? locale.meals.addProduct
                    : locale.products.header}
            </Header>
        </HeaderGroup>
    );
}

type ProductsSectionProps = {
    products: Signal<Product[]>;
};

function ProductsSection({ products }: ProductsSectionProps) {
    const { route } = useLocation();
    const draft = useMealDraft();

    const productOnClick = (p: Product) => () => {
        route(`products/${p.id}`, draft.isActive());
    };

    return (
        <List>
            {products.value.map((p) => (
                <FeatureItem
                    title={p.name}
                    description={p.brand}
                    onClick={productOnClick(p)}
                />
            ))}
        </List>
    );
}

function BottomSection() {
    const { locale } = useLocale();
    const { route } = useLocation();

    const createOnClick = () => route('/products/new');

    return (
        <BottomGroup>
            <PrimaryButton onClick={createOnClick}>
                {locale.products.create}
            </PrimaryButton>
        </BottomGroup>
    );
}

export function ProductListPage() {
    const { locale } = useLocale();

    const { data: products } = useQuery(() => {
        return ProductQueries.getMany();
    });

    const filter = useSignal('');
    const filtered = useComputed(() => {
        const lower = filter.value.trim().toLowerCase();
        return (products.value || []).filter(
            (p) =>
                p.name?.toLowerCase().includes(lower) ||
                p.brand?.toLowerCase().includes(lower),
        );
    });

    const searchOnInput = (e: TargetedEvent<HTMLInputElement>) => {
        filter.value = e.currentTarget.value;
    };

    return (
        <Page>
            <HeaderSection />
            <Search
                placeholder={locale.products.searchPlaceholder}
                onInput={searchOnInput}
                value={filter.value}
            />
            <ScrollableContent>
                <ProductsSection products={filtered} />
            </ScrollableContent>
            <BottomSection />
        </Page>
    );
}
