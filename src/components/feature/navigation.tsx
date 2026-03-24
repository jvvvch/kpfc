import type { FunctionalComponent, VNode } from 'preact';
import { useLocation } from 'preact-iso';
import { type FillableIconProps, Icon } from '@/components/atomic';
import { useLocale, useMealDraft } from '@/contexts';
import { cn } from '@/utils';

type TabProps = {
    icon: FunctionalComponent<FillableIconProps>;
    title: string;
    path: string;
    root?: boolean;
};

const Tab = ({ icon, title, path: tabPath, root }: TabProps) => {
    const { route, path } = useLocation();
    const active = Boolean(path === tabPath || (path === '/' && root));

    return (
        <div
            onClick={() => route(tabPath)}
            className={cn(
                '-mx-2 flex-0 grow w-0 rounded-full p-2 flex flex-col gap-0 justify-center items-center z-10 duration-200',
                { 'text-primary': active },
            )}
        >
            <div className="[&_svg]:size-6">{icon({ fill: active })}</div>
            <div className="text-xs">{title}</div>
        </div>
    );
};

type TabContainerProps = {
    children: VNode<TabProps>[];
};

function TabContainer({ children }: TabContainerProps) {
    const { path } = useLocation();
    const activeIndex = children.findIndex(
        (c) => c.props.path === path || (path === '/' && c.props.root),
    );
    if (activeIndex === -1 && path !== '/') {
        return;
    }

    const offset = 1;
    const spacing = 0.5;
    const length = Array.isArray(children) ? children.length : 1;
    const width = `calc(${100 / length}% - ${2 * spacing} * var(--spacing) + var(--spacing) * ${offset})`;
    const left = `calc(${0.5 / length} * 100% - 0.5 * var(--element-width) + ${spacing} * var(--spacing) + 0.25 * ${offset} * var(--spacing))`;
    const transform = `translateX(calc(${activeIndex / length} * (100cqw - var(--element-width) - ${2 * spacing} * var(--spacing)))`;

    const style = {
        '--element-width': width,
        width: `var(--element-width)`,
        left,
        transform,
    };

    return (
        <div className="flex bg-card border-none gap-4 px-2.5 my-0 rounded-full relative justify-between contain-inline-size">
            {activeIndex !== -1 && (
                <div
                    className="absolute top-0 bottom-0 w-full animate-in fade-in duration-200"
                    style={{ left: -1.25 }}
                >
                    <div
                        className="absolute bg-sidebar top-0.5 bottom-0.5 rounded-full transition-all duration-200 ease-in-out"
                        style={style}
                    />
                </div>
            )}
            {children}
        </div>
    );
}

export function Navigation() {
    const { locale } = useLocale();
    const draft = useMealDraft();
    if (draft.isActive()) {
        return;
    }

    return (
        <TabContainer>
            <Tab
                path="/dashboard"
                title={locale.dashboard.title}
                icon={Icon.Chart}
                root
            />
            <Tab
                path="/products"
                title={locale.products.title}
                icon={Icon.Carrot}
            />
            <Tab
                path="/settings"
                title={locale.settings.title}
                icon={Icon.Gear}
            />
        </TabContainer>
    );
}
