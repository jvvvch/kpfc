import type { TargetedEvent } from 'preact';
import {
    Input,
    InputGroup,
    Section,
    Select,
    type SelectOption,
} from '@/components/atomic';
import { useLocale } from '@/contexts';
import type { Unit } from '@/domain/utils';
import { NumberSanitizer } from '@/utils';

type PortionSelectProps = {
    value: number;
    unit: Unit;
    availableUnits: Unit[];
    onChange?: (value: number, unit: Unit) => void;
};

export function PortionSelect({
    value,
    unit,
    availableUnits,
    onChange: _onChange,
}: PortionSelectProps) {
    const { locale } = useLocale();

    const options: SelectOption<Unit>[] = availableUnits.map((value) => ({
        label: locale.unit[value],
        value,
    }));

    const onInput = (e: TargetedEvent<HTMLInputElement>) => {
        e.currentTarget.value = NumberSanitizer.onInput(e.currentTarget.value);
    };
    const onChange = (e: TargetedEvent<HTMLInputElement>) => {
        e.currentTarget.value = NumberSanitizer.onChange(e.currentTarget.value);
        _onChange?.(NumberSanitizer.toNumber(e.currentTarget.value), unit);
    };
    const selectOnChange = (option: Unit) => {
        _onChange?.(value, option);
    };

    return (
        <>
            <div className="flex flex-row w-full justify-between">
                <Section>{locale.meals.portionSize}</Section>
            </div>
            <div className="flex flex-row w-full justify-between gap-4">
                <InputGroup variant="even" animate="left">
                    <Input
                        onInput={onInput}
                        onChange={onChange}
                        value={String(value)}
                    />
                </InputGroup>
                <Select
                    animate="right"
                    options={options}
                    selected={unit}
                    onChange={selectOnChange}
                />
            </div>
        </>
    );
}
