import { useSignalRef } from '@preact/signals/utils';
import { cva, type VariantProps } from 'cva';
import type { TargetedEvent } from 'preact';
import { useLayoutEffect } from 'preact/hooks';
import type { ChildrenProps, TextInputProps } from '@/types';
import { cn } from '@/utils';

export function Caption({ children }: ChildrenProps) {
    return (
        <p className="min-w-0 w-fit text-left text-lg leading-none font-normal text-muted-foreground animate-in-from-top">
            {children}
        </p>
    );
}

export function Hint({ children }: ChildrenProps) {
    return (
        <div className="w-full block truncate text-wrap text-muted-foreground text-left leading-none text-sm font-normal py-3 px-4 my-0 min-w-0 animate-in-from-top">
            {children}
        </div>
    );
}

export function Section({ children }: ChildrenProps) {
    return (
        <h6 className="font-semibold text-foreground/50 animate-in-from-top">
            {children}
        </h6>
    );
}

const headerVariants = cva(
    'font-bold max-w-full text-wrap wrap-break-word placeholder:truncate outline-none animate-in-from-top',
    {
        variants: {
            size: {
                lg: 'text-3xl',
                sm: 'text-base text-foreground/65',
            },
        },
        defaultVariants: {
            size: 'lg',
        },
    },
);

export type HeaderProps = ChildrenProps & VariantProps<typeof headerVariants>;

export function Header({ children, size }: HeaderProps) {
    return <span className={cn(headerVariants({ size }))}>{children}</span>;
}

export type EditableHeaderProps = TextInputProps<HTMLTextAreaElement> &
    VariantProps<typeof headerVariants> & {
        edit?: boolean;
    };

export function EditableHeader({
    edit,
    size,
    onInput: _onInput,
    ...props
}: EditableHeaderProps) {
    const ref = useSignalRef(null);

    const fixLayout = () => {
        if (!ref.current) {
            return;
        }
        ref.current.style.height = 'inherit';
        ref.current.style.height = `${ref.current.scrollHeight}px`;
    };

    useLayoutEffect(() => {
        fixLayout();
    }, [ref.value, props.value]);

    const onInput = (e: TargetedEvent<HTMLTextAreaElement>) => {
        fixLayout();
        _onInput?.(e);
    };

    return (
        <textarea
            className={cn(headerVariants({ size }), 'resize-none')}
            disabled={!edit}
            ref={ref}
            {...props}
            onInput={onInput}
            rows={1}
        />
    );
}
