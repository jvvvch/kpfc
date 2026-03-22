import { cva, type VariantProps } from 'cva';
import type { ChildrenProps, ClickableProps, TextInputProps } from '@/types';
import { cn } from '@/utils';

const itemVariants = cva(
    'w-full flex items-center justify-center py-3 px-4 my-0 border border-transparent gap-2.5 animate-in-from-top-sm',
    {
        variants: {
            variant: {
                default: 'rounded-full',
                button: 'rounded-t-none rounded-b-xl text-primary p-0',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export type ItemProps = ChildrenProps &
    ClickableProps &
    VariantProps<typeof itemVariants>;

export function Item({ children, onClick, variant }: ItemProps) {
    return (
        <div onClick={onClick} className={cn(itemVariants({ variant }))}>
            {children}
        </div>
    );
}

export function ItemContent({ children }: ChildrenProps) {
    return (
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">{children}</div>
    );
}

export function ItemTitle({ children }: ChildrenProps) {
    return (
        <p className="w-full truncate font-medium block text-lg">{children}</p>
    );
}

export function ItemDescription({ children }: ChildrenProps) {
    return (
        <p className="block w-full truncate text-muted-foreground text-left text-sm font-normal">
            {children}
        </p>
    );
}

export function ItemActions({ children }: ChildrenProps) {
    return (
        <div className="ml-auto text-muted-foreground flex items-center gap-2 [&>.icon-button]:ml-2">
            {children}
        </div>
    );
}

export function ItemCaption({ children }: ChildrenProps) {
    return (
        <p className="min-w-0 w-fit text-left text-lg font-normal block underline-offset-4 ml-auto">
            {children}
        </p>
    );
}

export function ItemEditableCaption(props: TextInputProps<HTMLInputElement>) {
    return (
        <input
            type="text"
            className="min-w-0 w-30 text-foreground text-right font-normal outline-none border-none text-lg"
            {...props}
            onBlur={props.onChange}
        />
    );
}

export function ItemSeparator() {
    return <div className="bg-border shrink-0 h-px max-w-full my-0 mx-6" />;
}

export function List({ children }: ChildrenProps) {
    children = !Array.isArray(children)
        ? children
        : children.filter((child) => !Array.isArray(child) || child.length > 0);

    return (
        <div className="flex w-full flex-col gap-0 bg-card rounded-3xl">
            {Array.isArray(children)
                ? children.filter(Boolean).map((child, index) => (
                      <>
                          {index > 0 && <ItemSeparator />}
                          {child}
                      </>
                  ))
                : children}
        </div>
    );
}
