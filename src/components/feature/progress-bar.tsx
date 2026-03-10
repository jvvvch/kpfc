import { cva, type VariantProps } from 'cva';
import type { VNode } from 'preact';
import { cn } from '@/utils';

const progressBarGroupVariants = cva('', {
    variants: {
        size: {
            lg: 'text-lg',
            xs: 'text-xs',
        },
    },
    defaultVariants: {
        size: 'lg',
    },
});

type ProgressBarGroupProps = VariantProps<typeof progressBarGroupVariants> & {
    children: VNode<ProgressBarProps>[] | VNode<ProgressBarProps>;
    title: VNode | string;
    description: VNode | string;
};

export function ProgressBarGroup({
    children,
    title,
    description,
    size = 'lg',
}: ProgressBarGroupProps) {
    children = Array.isArray(children) ? children : [children];
    children.forEach((children) => {
        children.props.size = size;
    });

    return (
        <div className="w-full mx-auto flex flex-col items-center justify-center gap-0">
            <div className="relative">
                <svg viewBox="0 0 200 110" className="w-full px-5">
                    <ProgressBar progress={1} size={size} />
                    {children}
                </svg>
                <span
                    className={cn(
                        progressBarGroupVariants({
                            className: 'absolute w-full text-center bottom-0',
                            size,
                        }),
                    )}
                >
                    {title}
                </span>
            </div>
            {description && (
                <span className={cn(progressBarGroupVariants({ size }))}>
                    {description}
                </span>
            )}
        </div>
    );
}

const progressBarVariants = cva('transition-all duration-300', {
    variants: {
        color: {
            default: 'text-background',
            warn: 'text-chart-warn',
            ok: 'text-chart-ok',
            danger: 'text-chart-danger',
        },
    },
    defaultVariants: {
        color: 'default',
    },
});

export type ProgressColor = VariantProps<typeof progressBarVariants>['color'];

const progressBarStrokeVariants: Record<
    VariantProps<typeof progressBarGroupVariants>['size'],
    number
> = {
    xs: 33,
    lg: 27,
};

type ProgressBarProps = VariantProps<typeof progressBarVariants> &
    VariantProps<typeof progressBarGroupVariants> & {
        progress: number;
    };

export function ProgressBar({ progress, color, size }: ProgressBarProps) {
    const stroke = progressBarStrokeVariants[size];
    const circleSize = 200;
    const radius = (circleSize - stroke) / 2;
    const startX = stroke / 2;
    const endX = circleSize - stroke / 2;
    const centerY = circleSize / 2;

    const arcRadius = radius + 2;
    const y = circleSize / 2 - 10;
    const dx = (endX - startX) / 2;
    const dy = centerY - y;

    const chordLength = Math.sqrt(dx * dx + dy * dy) * 2;
    const angle = 2 * Math.asin(chordLength / (2 * arcRadius));
    const circumference = angle * arcRadius;
    const capCompensation = stroke;
    const visualArcLength = circumference + stroke;
    const dashOffset = visualArcLength * (1 - progress) + capCompensation;

    return (
        <path
            className={cn(progressBarVariants({ color }))}
            d={`M ${stroke / 2},${y} A ${radius + 2},${radius + 2} 0 0 1 ${circleSize - stroke / 2},${y}`}
            fill="none"
            stroke="currentColor"
            stroke-width={stroke}
            stroke-linecap="round"
            stroke-dasharray={visualArcLength}
            stroke-dashoffset={dashOffset}
        />
    );
}
