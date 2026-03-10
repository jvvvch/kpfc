import { cva, type VariantProps } from 'cva';
import type { ChildrenProps, TextInputProps } from '@/types';
import { cn } from '@/utils';

export function Input({
    value,
    onInput,
    onChange,
    placeholder,
}: TextInputProps<HTMLInputElement>) {
    return (
        <input
            onInput={onInput}
            onChange={onChange}
            value={value}
            className="px-2.5 py-1 placeholder-muted-foreground rounded-none border-0 bg-transparent shadow-none flex-1 pr-1.5 text-base outline-none"
            type="text"
            placeholder={placeholder}
        />
    );
}

const inputGroupVariants = cva(
    'w-full flex min-w-0 items-center outline-none bg-card rounded-full py-5 px-1.5 border-input h-6 border',
    {
        variants: {
            variant: {
                default: '',
                even: 'flex-1',
            },
            animate: {
                top: 'animate-in-from-top-sm',
                left: 'animate-in-from-left',
            },
        },
        defaultVariants: {
            variant: 'default',
            animate: 'top',
        },
    },
);

type InputGroupProps = ChildrenProps & VariantProps<typeof inputGroupVariants>;

export function InputGroup({ children, variant, animate }: InputGroupProps) {
    return (
        <div className={cn(inputGroupVariants({ variant, animate }))}>
            {children}
        </div>
    );
}

export function InputIcon({ children }: ChildrenProps) {
    return (
        <div className="h-auto pr-2 text-foreground order-last [&>svg:not([class*='size-'])]:size-4">
            {children}
        </div>
    );
}
