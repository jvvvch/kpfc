import {
    type ReadonlySignal,
    type Signal,
    useComputed,
    useSignal,
    useSignalEffect,
} from '@preact/signals';
import type { TargetedEvent } from 'preact';
import { useRef } from 'preact/hooks';
import { useLocation, useRoute } from 'preact-iso';
import { uuidv7 } from 'uuidv7';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogDescription,
    DialogTitle,
    EditableHeader,
    Icon,
    IconButton,
    List,
    PrimaryButton,
    Section,
    StackCol,
    StackRow,
} from '@/components/atomic';
import {
    BottomGroup,
    FeatureItemSelect,
    FeatureItemSwitch,
    FeatureItemTextInput,
    HeaderActions,
    HeaderGroup,
    MacrosDisplay,
    Page,
    PortionSelect,
} from '@/components/feature';
import { useLocale, useMealDraft } from '@/contexts';
import type { Product } from '@/domain/entities';
import { IngredientType } from '@/domain/entities';
import { ProductQueries } from '@/domain/queries/product';
import { ingredientMacros, Unit } from '@/domain/utils';
import { useQuery, useSwitch } from '@/hooks';
import { NumberSanitizer } from '@/utils';

type HeaderSectionProps = {
    product: Signal<Product | null>;
    deleting: Signal<boolean>;
    edit: Signal<boolean>;
    isNew: boolean;
};

function HeaderSection({ product, deleting, edit, isNew }: HeaderSectionProps) {
    const { locale } = useLocale();
    const draft = useMealDraft();

    const showEdit = useComputed(() => product.value !== null && !isNew);
    const showDelete = useComputed(
        () =>
            product.value !== null && !isNew && edit.value && !draft.isActive(),
    );

    const onChange = (
        prop: 'name' | 'brand',
        e: TargetedEvent<HTMLTextAreaElement>,
    ) => {
        if (!product.value) {
            return;
        }
        product.value = { ...product.value, [prop]: e.currentTarget.value };
    };
    const editOnClick = () => {
        edit.value = !edit.value;
    };
    const deleteOnClick = async () => {
        if (isNew) {
            return;
        }
        deleting.value = true;
    };

    return (
        <HeaderGroup>
            <HeaderActions>
                <IconButton.ChevronLeft onClick={() => window.history.back()} />
                <StackRow>
                    {showDelete.value && (
                        <IconButton.Trash
                            onClick={deleteOnClick}
                            color="destructive"
                        />
                    )}
                    {showEdit.value && (
                        <IconButton.Edit
                            onClick={editOnClick}
                            color={edit.value ? 'inactive' : 'default'}
                        />
                    )}
                </StackRow>
            </HeaderActions>
            <StackCol>
                <EditableHeader
                    value={product.value?.name || ''}
                    edit={edit.value}
                    onChange={(e) => onChange('name', e)}
                    placeholder={locale.products.createHeaderPlaceholder}
                />
                <EditableHeader
                    size="sm"
                    value={product.value?.brand || ''}
                    edit={edit.value}
                    onChange={(e) => onChange('brand', e)}
                    placeholder={locale.products.createBrandPlaceholder}
                />
            </StackCol>
        </HeaderGroup>
    );
}

type MacrosSectionProps = {
    product: Signal<Product>;
    edit: Signal<boolean>;
};

function MacrosSection({ product, edit }: MacrosSectionProps) {
    if (!product.value) {
        return;
    }

    const { locale } = useLocale();

    const hasPiece = useComputed(() => product.value.piece !== null);
    const unit = useComputed(() => locale.unit[product.value.unit]);

    return (
        <>
            <Section>{locale.products.per100(unit.value)}</Section>
            <MacrosDisplay edit={edit.value} macros={product} />
            {hasPiece.value && (
                <>
                    <Section>
                        {locale.products.perPiece} - {product.value.piece}{' '}
                        {unit.value}
                    </Section>
                    <MacrosDisplay
                        edit={edit.value}
                        macros={product}
                        piece={product.value.piece}
                    />
                </>
            )}
        </>
    );
}

type ProductSettingsProps = {
    product: Signal<Product>;
};

function ProductSettingUnit({ product }: ProductSettingsProps) {
    const { locale } = useLocale();
    const unitOptions = useComputed(() =>
        [Unit.gram, Unit.ml].map((v) => ({
            label: locale.unit[v],
            value: v,
        })),
    );

    const unitOnChange = (value: Unit) => {
        product.value = { ...product.value, unit: value };
    };

    return (
        <List>
            <FeatureItemSelect
                title={locale.products.unit}
                options={unitOptions.value}
                selected={product.value.unit}
                onChange={unitOnChange}
                variant="noBorder"
            />
        </List>
    );
}

function ProductSettingPiece({ product }: ProductSettingsProps) {
    const { locale } = useLocale();
    const { onSwitch: onSwitchPiece } = useSwitch(product.peek().piece || 100);

    const hasPiece = useComputed(() => product.value.piece !== null);
    const unit = useComputed(() => locale.unit[product.value.unit]);

    const pieceOnInput = (e: TargetedEvent<HTMLInputElement>) => {
        e.currentTarget.value = NumberSanitizer.onInput(e.currentTarget.value, {
            float: true,
        });
    };
    const pieceOnChange = (e: TargetedEvent<HTMLInputElement>) => {
        product.value = {
            ...product.value,
            piece: NumberSanitizer.toNumber(e.currentTarget.value),
        };
    };
    const switchOnClick = () => {
        product.value = {
            ...product.value,
            piece: onSwitchPiece(product.value.piece),
        };
    };

    return (
        <List>
            <FeatureItemSwitch
                title={locale.products.hasPiece}
                checked={hasPiece.value}
                onClick={switchOnClick}
            />
            {hasPiece.value && (
                <FeatureItemTextInput
                    title={locale.products.perPiece}
                    caption={unit.value}
                    maxlength={4}
                    value={String(product.value.piece || '')}
                    onInput={pieceOnInput}
                    onChange={pieceOnChange}
                    placeholder="0"
                />
            )}
        </List>
    );
}

function ProductSettingsSection({ product }: ProductSettingsProps) {
    if (!product.value) {
        return;
    }

    return (
        <>
            <ProductSettingUnit product={product} />
            <ProductSettingPiece product={product} />
        </>
    );
}

type MealDraftActionsProps = {
    product: ReadonlySignal<Product | null>;
};

function MealDraftActions({ product }: MealDraftActionsProps) {
    const { route } = useLocation();
    const { locale } = useLocale();
    const draft = useMealDraft();

    if (!draft.isActive() || !product.value) {
        return;
    }

    const availableUnits = [product.value.unit];
    if (product.value.piece !== null) {
        availableUnits.push(Unit.piece);
    }

    const selected = useComputed(() => {
        if (draft.currentIngredient.value.type === IngredientType.weight) {
            return product.value.unit;
        }
        return Unit.piece;
    });

    const onChange = (amount: number, unit: Unit) => {
        const type =
            unit === Unit.piece ? IngredientType.piece : IngredientType.weight;
        if (draft.currentIngredient.value.type !== type) {
            if (unit === Unit.piece) {
                amount = 1;
            } else {
                amount = 100;
            }
        }
        draft.updateCurrentIngredient({
            amount,
            type,
        });
    };
    const addOnClick = () => {
        draft.commitCurrentIngredient(product.value);
        draft.clearCurrentIngredient();
        route(`/meals/${draft.meal.value.id}`, true);
    };

    return (
        <>
            <PortionSelect
                value={draft.currentIngredient.value.amount}
                availableUnits={availableUnits}
                unit={selected.value}
                onChange={onChange}
            />
            <MacrosDisplay
                macros={ingredientMacros(
                    product.value,
                    draft.currentIngredient.value,
                )}
            />
            <PrimaryButton onClick={addOnClick}>
                {locale.meals.addProduct}
            </PrimaryButton>
        </>
    );
}

type DeleteDialogProps = {
    product: Signal<Product | null>;
    mealUsageCount: Signal<number>;
    deleting: Signal<boolean>;
};

function DeleteDialog({
    product,
    deleting,
    mealUsageCount,
}: DeleteDialogProps) {
    const { route } = useLocation();
    const { locale } = useLocale();

    const cancelOnClick = () => {
        deleting.value = !deleting.value;
    };
    const deleteOnClick = async () => {
        await ProductQueries.delete(product.value.id);
        route('/products');
    };

    const description =
        mealUsageCount.value === 0
            ? locale.products.deleteDialog.descriptionNoMeals
            : locale.products.deleteDialog.description(mealUsageCount.value);

    return (
        <Dialog isOpen={deleting} onClose={cancelOnClick}>
            <DialogContent>
                <DialogTitle>{locale.products.deleteDialog.header}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelOnClick}>{locale.common.cancel}</Button>
                <Button onClick={deleteOnClick} color="destructive">
                    <Icon.Trash color="inherit" />{' '}
                    {locale.products.deleteDialog.button}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

type BottomSectionProps = {
    product: Signal<Product | null>;
    edit: Signal<boolean>;
};

function BottomSection({ product, edit }: BottomSectionProps) {
    const { locale } = useLocale();
    const { route } = useLocation();
    const draft = useMealDraft();

    const showSave = useComputed(
        () => Boolean(product.value?.name) && edit.value,
    );
    const showMealDraftActions = useComputed(
        () => !edit.value && draft.isActive() && draft.currentIngredient.value,
    );

    const saveOnClick = async () => {
        await ProductQueries.save(product.value);
        edit.value = false;
        route(`/products/${product.value.id}`, true);
    };

    return (
        <BottomGroup>
            {showSave.value && (
                <PrimaryButton onClick={saveOnClick}>
                    {locale.common.save}
                </PrimaryButton>
            )}
            {showMealDraftActions.value && (
                <MealDraftActions product={product} />
            )}
        </BottomGroup>
    );
}

export function ProductPage() {
    const { query } = useLocation();
    const {
        params: { id },
    } = useRoute();
    const draft = useMealDraft();

    const isNew = id === 'new';
    const deleting = useSignal(false);
    const edit = useSignal(query.edit === 'true' || isNew);
    const init = useRef(false);

    const { data: product } = useQuery(async () => {
        if (isNew) {
            return ProductQueries.getDefaultProduct();
        }
        return ProductQueries.get(id);
    });
    const { data: mealUsageCount } = useQuery(async () => {
        if (isNew) {
            return 0;
        }
        return ProductQueries.countMealUsage(id);
    });

    useSignalEffect(() => {
        if (
            !init.current &&
            draft.isActive() &&
            !draft.currentIngredient.value &&
            product.value
        ) {
            let type = IngredientType.weight,
                amount = 100;
            if (product.value.piece) {
                type = IngredientType.piece;
                amount = 1;
            }
            draft.setCurrentIngredient({
                id: uuidv7(),
                type,
                amount,
            });
            init.current = true;
        }
    });

    return (
        <Page>
            <HeaderSection
                product={product}
                deleting={deleting}
                edit={edit}
                isNew={isNew}
            />
            <MacrosSection product={product} edit={edit} />
            {edit.value && <ProductSettingsSection product={product} />}
            {deleting.value && (
                <DeleteDialog
                    product={product}
                    deleting={deleting}
                    mealUsageCount={mealUsageCount}
                />
            )}
            <BottomSection product={product} edit={edit} />
        </Page>
    );
}
