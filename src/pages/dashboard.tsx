import { type Signal, useComputed } from '@preact/signals';
import { addDays, format, parse } from 'date-fns';
import { useLocation, useRoute } from 'preact-iso';
import {
    Card,
    Header,
    IconButton,
    List,
    PrimaryButton,
} from '@/components/atomic';
import {
    BottomGroup,
    DashboardText,
    FeatureItem,
    HeaderActions,
    HeaderGroup,
    Page,
    ProgressBar,
    ProgressBarGroup,
    type ProgressColor,
    ScrollableContent,
} from '@/components/feature';
import { useLocale } from '@/contexts';
import {
    type CalculatedMeal,
    ConfigSection,
    type MacroCode,
} from '@/domain/entities';
import { ConfigQueries } from '@/domain/queries/config';
import { MealQueries } from '@/domain/queries/meal';
import {
    type CalculatedDashboard,
    type DayPosition,
    getDayPosition,
    macroCodeOrder,
    ProgressCalculator,
    ProgressStatus,
} from '@/domain/utils';
import { useQuery } from '@/hooks';

const dateFormat = 'yyyy-MM-dd';

type HeaderSectionProps = {
    date: Date;
};

function HeaderSection({ date }: HeaderSectionProps) {
    const { locale } = useLocale();
    const { route } = useLocation();

    const controlsOnClick = (days: number) => {
        const newDate = addDays(date, days);
        route(`/dashboard?day=${format(newDate, dateFormat)}`);
    };

    const headerDate = locale.common.shortDate(date);

    return (
        <HeaderGroup>
            <HeaderActions>
                <IconButton.ChevronLeft onClick={() => controlsOnClick(-1)} />
                <Header>{headerDate}</Header>
                <IconButton.ChevronRight onClick={() => controlsOnClick(1)} />
            </HeaderActions>
        </HeaderGroup>
    );
}

const colorByProgressStatus: Record<ProgressStatus, ProgressColor> = {
    [ProgressStatus.less]: 'warn',
    [ProgressStatus.ok]: 'ok',
    [ProgressStatus.between]: 'ok',
    [ProgressStatus.more]: 'danger',
};

type KcalProgressProps = {
    calc: Signal<CalculatedDashboard>;
    dayPosition: DayPosition;
};

function KcalProgress({ calc, dayPosition }: KcalProgressProps) {
    const { locale } = useLocale();
    const {
        progress: { progress, status, value },
        total,
    } = calc.value.kcal;

    const title = DashboardText.KcalTitle(locale, total);
    const description = DashboardText.KcalDescription(
        locale,
        status,
        dayPosition,
        value,
    );
    const color = colorByProgressStatus[status];

    return (
        <ProgressBarGroup title={title} description={description}>
            <ProgressBar progress={progress} color={color} />
        </ProgressBarGroup>
    );
}

type MacroProgressProps = {
    calc: Signal<CalculatedDashboard>;
    dayPosition: DayPosition;
    code: MacroCode;
};

function MacroProgress({ calc, dayPosition, code }: MacroProgressProps) {
    const { locale } = useLocale();
    const {
        progress: { progress, status },
        total,
        goal,
    } = calc.value[code];

    const title = DashboardText.MacroTitle(locale, code);
    const description = DashboardText.MacroDescription(
        status,
        dayPosition,
        total,
        goal,
    );
    const color = colorByProgressStatus[status];

    return (
        <ProgressBarGroup size="xs" title={title} description={description}>
            <ProgressBar progress={progress} color={color} />
        </ProgressBarGroup>
    );
}

type ProgressSectionProps = {
    calc: Signal<CalculatedDashboard>;
    dayPosition: DayPosition;
};

function ProgressSection({ calc, dayPosition }: ProgressSectionProps) {
    return (
        <>
            <Card>
                <KcalProgress calc={calc} dayPosition={dayPosition} />
            </Card>
            <Card>
                {macroCodeOrder.slice(1).map((code) => (
                    <MacroProgress
                        calc={calc}
                        dayPosition={dayPosition}
                        code={code}
                    />
                ))}
            </Card>
        </>
    );
}

type MealItemProps = {
    meal: CalculatedMeal;
};

function MealItem({ meal }: MealItemProps) {
    const { route } = useLocation();
    const { locale } = useLocale();

    const description = `${Math.floor(meal.kcal)} ${locale.unit.kcal}`;
    const caption = format(meal.committed_at, 'HH:mm');

    const onClick = () => {
        route(`/meals/${meal.id}`);
    };

    return (
        <FeatureItem
            onClick={onClick}
            title={meal.name}
            description={description}
            caption={caption}
        />
    );
}

type MealsSectionProps = {
    meals: Signal<CalculatedMeal[]>;
};

function MealsSection({ meals }: MealsSectionProps) {
    return (
        <List>
            {meals.value.map((meal) => (
                <MealItem meal={meal} />
            ))}
        </List>
    );
}

function BottomSection() {
    const { route } = useLocation();
    const { locale } = useLocale();

    const onClick = () => {
        route('/meals/new');
    };

    return (
        <BottomGroup>
            <PrimaryButton onClick={onClick}>
                {locale.meals.create}
            </PrimaryButton>
        </BottomGroup>
    );
}

export function DashboardPage() {
    const {
        query: { day },
    } = useRoute();
    const date = day ? parse(day, dateFormat, new Date()) : new Date();

    const { data: meals } = useQuery(() => {
        return MealQueries.getManyCommittedByDay(date);
    }, [day]);
    const { data: goals } = useQuery(() => {
        return ConfigQueries.getMany(ConfigSection.daily_goal);
    });

    const calc = useComputed(() => {
        if (!meals.value || !goals.value) {
            return null;
        }
        return ProgressCalculator.calculateDashboard(goals.value, meals.value);
    });

    const dayPosition = getDayPosition(date);

    return (
        <Page>
            <HeaderSection date={date} />
            {calc.value && (
                <ProgressSection calc={calc} dayPosition={dayPosition} />
            )}
            <ScrollableContent>
                {meals.value && <MealsSection meals={meals} />}
            </ScrollableContent>
            <BottomSection />
        </Page>
    );
}
