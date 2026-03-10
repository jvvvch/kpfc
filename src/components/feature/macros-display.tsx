import { Signal } from '@preact/signals';
import type { TargetedEvent } from 'preact';
import { useLocale } from '@/contexts';
import type { MacroCode, Macros } from '@/domain/entities';
import { macroCodeOrder, weightedMacros } from '@/domain/utils';
import { NumberSanitizer } from '@/utils';

const macroStyles = 'min-w-0 w-full text-center outline-none';

type MacroProps = {
    edit: boolean;
    code: MacroCode;
    value: number;
    onChange: (code: MacroCode, n: number) => void;
};

function Macro({ edit, code, value, onChange: _onChange }: MacroProps) {
    const { locale } = useLocale();
    value = NumberSanitizer.reduce(value, 4);

    const onInput = (e: TargetedEvent<HTMLInputElement>) => {
        e.currentTarget.value = NumberSanitizer.onInput(e.currentTarget.value, {
            float: true,
        });
    };

    const onChange = (e: TargetedEvent<HTMLInputElement>) => {
        e.currentTarget.value = NumberSanitizer.onChange(e.currentTarget.value);
        _onChange?.(code, NumberSanitizer.toNumber(e.currentTarget.value));
    };

    return (
        <div className="w-full flex flex-col justify-center items-center gap-0 py-2.5">
            <div className="font-bold text-lg w-full text-center">
                {!edit ? (
                    <span className={macroStyles}>{value}</span>
                ) : (
                    <input
                        className={macroStyles}
                        type="text"
                        inputmode="decimal"
                        maxlength={4}
                        placeholder="0"
                        value={String(value || '')}
                        onInput={onInput}
                        onChange={onChange}
                        onBlur={onChange}
                    />
                )}
            </div>
            <p className="text-center text-sm leading-none">
                {locale.macros[code].short}
            </p>
        </div>
    );
}

type MacrosDisplayProps =
    | {
          edit: boolean;
          macros: Signal<Macros>;
          piece?: number;
      }
    | {
          edit?: never;
          piece?: never;
          macros: Macros;
      };

export function MacrosDisplay({ edit, macros, piece }: MacrosDisplayProps) {
    const value = macros instanceof Signal ? macros.value : macros;
    const isPiece = piece !== undefined;
    const mappedValue = isPiece ? weightedMacros(value, piece) : value;

    const onChange = (code: MacroCode, n: number) => {
        if (!macros || !(macros instanceof Signal)) {
            return;
        }
        const amount = isPiece ? (n * 100) / piece : n;
        macros.value = { ...macros.value, [code]: amount };
    };

    return (
        <div className="flex bg-card rounded-4xl border-none gap-4 py-0 px-4 w-full animate-in-from-top-sm">
            <div className="flex flex-row w-full justify-center items-center gap-4">
                {macroCodeOrder.map((code) => (
                    <Macro
                        edit={edit}
                        value={mappedValue?.[code] || 0}
                        code={code}
                        onChange={onChange}
                    />
                ))}
            </div>
        </div>
    );
}
