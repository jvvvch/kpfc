import { type ReadonlySignal, useComputed } from '@preact/signals';
import { format } from 'date-fns';
import type { TargetedEvent, VNode } from 'preact';
import { useRef } from 'preact/hooks';
import { useLocation, useRoute } from 'preact-iso';
import { uuidv7 } from 'uuidv7';
import {
    Caption,
    DateTimePicker,
    EditableHeader,
    IconButton,
    List,
    PrimaryButton,
    StackRow,
} from '@/components/atomic';
import {
    BottomGroup,
    FeatureItem,
    FeatureItemOption,
    HeaderActions,
    HeaderGroup,
    MacrosDisplay,
    Page,
    PortionSelect,
    ScrollableContent,
} from '@/components/feature';
import { useLocale, useMealDraft } from '@/contexts';
import type { FullMeal, FullMealIngredient } from '@/domain/entities';
import { IngredientType } from '@/domain/entities';
import { MealQueries } from '@/domain/queries/meal';
import { portionedMacros, Unit } from '@/domain/utils';
import { useQuery } from '@/hooks';

type HeaderSectionProps = {
    isNew: boolean;
    meal: ReadonlySignal<FullMeal>;
};

function HeaderSection({ isNew, meal }: HeaderSectionProps) {
    const { route } = useLocation();
    const { locale } = useLocale();
    const draft = useMealDraft();

    const dateStr = useComputed(() =>
        locale.datetime.at(new Date(meal.value.committed_at)),
    );
    const eaten = useComputed(() =>
        meal.value.portion < 1
            ? `${locale.meals.eaten}: ${Math.floor(meal.value.portion * 100)}%`
            : null,
    );

    const backOnClick = () => {
        const dashboardDay = format(meal.value.committed_at, 'yyyy-MM-dd');
        draft.cancel();
        route(`/dashboard?day=${dashboardDay}`);
    };
    const editOnClick = () => {
        if (draft.isActive()) {
            draft.cancel();
        } else {
            draft.start(meal.value);
        }
    };
    const removeOnClick = async () => {
        if (!isNew) {
            await MealQueries.delete(meal.value.id);
        }
        draft.cancel();
        route('/dashboard');
    };
    const headerOnChange = (e: TargetedEvent<HTMLTextAreaElement>) => {
        draft.update({ name: e.currentTarget.value });
    };
    const commmitedOnChange = (date: Date) => {
        draft.update({ committed_at: date.getTime() });
    };

    return (
        <HeaderGroup>
            <HeaderActions>
                <IconButton.ChevronLeft onClick={backOnClick} />
                <StackRow>
                    {!isNew && draft.isActive() && (
                        <IconButton.Trash
                            color="destructive"
                            onClick={removeOnClick}
                        />
                    )}
                    {!isNew && (
                        <IconButton.Edit
                            color={draft.isActive() ? 'inactive' : 'default'}
                            onClick={editOnClick}
                        />
                    )}
                </StackRow>
            </HeaderActions>
            <EditableHeader
                value={meal.value.name}
                edit={draft.isActive()}
                onChange={headerOnChange}
                placeholder={locale.meals.namePlaceholder}
            />
            <HeaderActions>
                <StackRow>
                    <Caption>{dateStr.value}</Caption>
                    {draft.isActive() && (
                        <DateTimePicker
                            value={new Date(meal.value.committed_at)}
                            onChange={commmitedOnChange}
                            animate="fromTop"
                        />
                    )}
                </StackRow>
                {!draft.isActive() && eaten.value && (
                    <Caption>{eaten.value}</Caption>
                )}
            </HeaderActions>
        </HeaderGroup>
    );
}

type IngredientItemProps = {
    ingredient: FullMealIngredient;
};

export function IngredientItem({ ingredient }: IngredientItemProps) {
    const { route } = useLocation();
    const { locale } = useLocale();
    const draft = useMealDraft();

    const {
        id,
        product: { id: productId, name, unit: productUnit },
        type,
        kcal,
        amount,
    } = ingredient;

    const unit = type === IngredientType.weight ? productUnit : Unit.piece;

    const description = `${Math.floor(kcal)} ${locale.unit.kcal}`;
    const caption = `${Math.floor(amount)} ${locale.unit[unit]}`;

    const onClick = () => {
        if (draft.isActive()) {
            draft.setCurrentIngredient({ id, type, amount });
        }
        route(`/products/${productId}`);
    };
    const removeOnClick = (e: TargetedEvent) => {
        e.stopPropagation();
        draft.removeIngredient(id);
    };

    const removeIcon = draft.isActive()
        ? IconButton.Trash({ onClick: removeOnClick, color: 'destructive' })
        : undefined;

    return (
        <FeatureItem
            title={name}
            description={description}
            caption={caption}
            onClick={onClick}
            icon={removeIcon}
        />
    );
}

type IngredientsSectionProps = {
    ingredients: FullMealIngredient[];
};

function IngredientsSection({ ingredients }: IngredientsSectionProps) {
    const { route } = useLocation();
    const { locale } = useLocale();
    const draft = useMealDraft();

    const addOnClick = () => {
        route('/products');
    };

    const list: VNode[] = ingredients.map((ingredient) =>
        IngredientItem({ ingredient }),
    );
    if (draft.isActive()) {
        list.push(
            FeatureItemOption({
                onClick: addOnClick,
                title: locale.products.add,
            }),
        );
    }

    return <List>{list}</List>;
}

type BottomSectionProps = {
    meal: ReadonlySignal<FullMeal>;
};

function BottomSection({ meal }: BottomSectionProps) {
    const { route } = useLocation();
    const { locale } = useLocale();
    const draft = useMealDraft();

    const portionOnChange = (value: number) => {
        draft.update({ portion: value / 100 });
    };
    const saveOnClick = async () => {
        if (!draft.isActive()) {
            return;
        }
        await MealQueries.save(draft.meal.value);
        const id = draft.meal.value.id;
        draft.cancel();
        route(`/meals/${id}`, true);
    };
    const copyOnClick = () => {
        draft.start({
            ...meal.value,
            id: uuidv7(),
            committed_at: Date.now(),
            ingredients: meal.value.ingredients.map((i) => ({
                ...i,
                id: uuidv7(),
            })),
        });
        route('/meals/new', true);
    };

    return (
        <BottomGroup>
            {draft.isActive() && (
                <PortionSelect
                    value={Math.floor(draft.meal.value.portion * 100)}
                    onChange={portionOnChange}
                    unit={Unit.percent}
                    availableUnits={[Unit.percent]}
                />
            )}
            {meal.value && (
                <MacrosDisplay
                    macros={portionedMacros(meal.value, meal.value.portion)}
                />
            )}
            {draft.isActive() && draft.meal.value.name !== '' && (
                <PrimaryButton onClick={saveOnClick}>
                    {locale.common.save}
                </PrimaryButton>
            )}
            {!draft.isActive() && (
                <PrimaryButton onClick={copyOnClick}>
                    {locale.meals.makeCopy}
                </PrimaryButton>
            )}
        </BottomGroup>
    );
}

export function MealPage() {
    const {
        params: { id },
    } = useRoute();
    const draft = useMealDraft();
    const init = useRef(false);

    const isNew = id === 'new';

    if (isNew && !draft.isActive() && !init.current) {
        draft.start();
    }
    init.current = true;

    const { data: meal } = useQuery(async () => {
        if (draft.isActive()) {
            return draft.meal.value;
        }
        return MealQueries.getFull(id);
    }, [id, draft.meal.value]);

    return (
        <Page>
            {meal.value && <HeaderSection isNew={isNew} meal={meal} />}
            <ScrollableContent>
                {meal.value && (
                    <IngredientsSection ingredients={meal.value.ingredients} />
                )}
            </ScrollableContent>
            <BottomSection meal={meal} />
        </Page>
    );
}
