import { cva, type VariantProps } from 'cva';
import { format } from 'date-fns';
import type { FunctionalComponent, TargetedEvent } from 'preact';
import { Icon, type IconProps } from './icon';

const variants = cva('absolute size-4 l-0 p-0 w-full h-full', {
    variants: {
        animate: {
            none: '',
            fromTop: 'animate-in-from-top',
        },
    },
    defaultVariants: {
        animate: 'none',
    },
});

export type DateTimePickerProps = {
    value: Date;
    onChange: (date: Date) => void;
    icon?: FunctionalComponent<IconProps>;
    type?: 'datetime' | 'date';
} & VariantProps<typeof variants>;

export function DateTimePicker({
    value,
    onChange: _onChange,
    icon = Icon.Edit,
    type = 'datetime',
    animate,
}: DateTimePickerProps) {
    const dateStr =
        type === 'datetime'
            ? format(value, 'yyyy-MM-ddTHH:mm')
            : format(value, 'yyyy-MM-dd');
    const onChange = (e: TargetedEvent<HTMLInputElement>) => {
        _onChange?.(new Date(e.currentTarget.value));
    };

    return (
        <div className="inline-block relative w-5 h-5">
            {icon({ className: variants({ animate }) })}
            <input
                onChange={onChange}
                className="absolute l-0 t-0 w-full h-full opacity-0 cursor:pointer box-border"
                type={type === 'datetime' ? 'datetime-local' : 'date'}
                value={dateStr}
            />
        </div>
    );
}
