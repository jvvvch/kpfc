import { format } from 'date-fns';
import type { TargetedEvent } from 'preact';
import { Icon } from './icon';

export type DateTimePickerProps = {
    value: Date;
    onChange: (date: Date) => void;
};

export function DateTimePicker({
    value,
    onChange: _onChange,
}: DateTimePickerProps) {
    const dateStr = format(value, 'yyyy-MM-ddTHH:mm');
    const onChange = (e: TargetedEvent<HTMLInputElement>) => {
        _onChange?.(new Date(e.currentTarget.value));
    };

    return (
        <div className="inline-block relative w-5">
            <Icon.Edit className="absolute size-4 l-0 p-0 w-full h-full animate-in-from-top" />
            <input
                onChange={onChange}
                className="absolute l-0 t-0 w-full h-full opacity-0 cursor:pointer box-border"
                type="datetime-local"
                value={dateStr}
                min="2026-01-01T00:00"
            />
        </div>
    );
}
