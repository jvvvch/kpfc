import type { ClickableProps } from '@/types';

export type SwitchProps = ClickableProps<HTMLInputElement> & {
    checked?: boolean;
};

export function Switch({ checked, onClick }: SwitchProps) {
    return (
        <label className="w-20 h-8 block rounded-full transition-all ease-out duration-200 bg-muted-foreground/30">
            <input
                className="peer sr-only pointer-events-none"
                type="checkbox"
                checked={checked}
                onClick={onClick}
            />
            <div className="outline-none relative w-full h-full bg-secondary rounded-full peer peer-checked:after:translate-x-[calc(75%)] peer-checked:bg-switch-on transition-all duration-300 ease-in-out pointer-events-none after:content-[''] after:absolute after:bg-white after:border after:border-border after:rounded-full after:h-full after:aspect-3/2 after:transition-all after:duration-300 after:ease-in-out" />
        </label>
    );
}
