import type { ComponentChildren, TargetedEvent } from 'preact';
import type { MouseEventHandler } from 'preact/compat';

export type ChildrenProps = { children?: ComponentChildren };

export type StyledProps = { className?: string };

export type StyledChildrenProps = ChildrenProps & StyledProps;

export type ClickableProps<T extends EventTarget = EventTarget> = {
    onClick?: MouseEventHandler<T>;
};

export type InputProps<T extends EventTarget> = {
    onChange?: (e: TargetedEvent<T>) => void;
    onInput?: (e: TargetedEvent<T>) => void;
};

export type CustomInputProps<T> = {
    value?: T;
    onChange?: (e: T) => void;
    onInput?: (e: T) => void;
};

export type TextInputProps<T extends EventTarget> = InputProps<T> & {
    value?: string;
    placeholder?: string;
    maxlength?: number;
};

export type Editable = {
    edit?: boolean;
};
