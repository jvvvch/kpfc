import type { ComponentChildren } from 'preact';
import {
    Icon,
    Item,
    ItemActions,
    ItemCaption,
    ItemContent,
    ItemDescription,
    ItemEditableCaption,
    ItemTitle,
    Select,
    type SelectProps,
    Switch,
    type SwitchProps,
} from '@/components/atomic';
import type { ClickableProps, TextInputProps } from '@/types';

type FeatureItemProps = {
    title: string;
    description?: string;
    caption?: string;
    icon?: ComponentChildren;
    onClick?: () => void;
};

export function FeatureItem({
    title,
    description,
    caption,
    icon = Icon.ChevronRight({}),
    onClick,
}: FeatureItemProps) {
    return (
        <Item onClick={onClick}>
            <ItemContent>
                <ItemTitle>{title}</ItemTitle>
                {description && (
                    <ItemDescription>{description}</ItemDescription>
                )}
            </ItemContent>
            <ItemActions>
                {caption && <ItemCaption>{caption}</ItemCaption>}
                {icon}
            </ItemActions>
        </Item>
    );
}

type FeatureItemOptionProps = ClickableProps & {
    title: string;
};

export function FeatureItemOption({ title, onClick }: FeatureItemOptionProps) {
    return (
        <Item variant="button" onClick={onClick}>
            <div className="text-primary w-full h-full flex items-center justify-center text-center p-3">
                {title}
            </div>
        </Item>
    );
}

type FeatureItemTextInput = TextInputProps<HTMLInputElement> & {
    title: string;
    caption?: string;
};

export function FeatureItemTextInput({
    title,
    caption,
    ...props
}: FeatureItemTextInput) {
    return (
        <Item>
            <ItemContent>
                <ItemTitle>{title}</ItemTitle>
            </ItemContent>
            <ItemActions>
                <ItemEditableCaption {...props} />
                {caption && <ItemCaption>{caption}</ItemCaption>}
            </ItemActions>
        </Item>
    );
}

type FeatureItemSelectProps<T> = SelectProps<T> & {
    title: string;
};

export function FeatureItemSelect<T>({
    title,
    ...props
}: FeatureItemSelectProps<T>) {
    return (
        <Item>
            <ItemContent>
                <ItemTitle>{title}</ItemTitle>
            </ItemContent>
            <ItemActions>
                <Select {...props} />
            </ItemActions>
        </Item>
    );
}

type FeatureItemSwitchProps = SwitchProps & {
    title: string;
};

export function FeatureItemSwitch({ title, ...props }: FeatureItemSwitchProps) {
    return (
        <Item>
            <ItemContent>
                <ItemTitle>{title}</ItemTitle>
            </ItemContent>
            <ItemActions>
                <Switch {...props} />
            </ItemActions>
        </Item>
    );
}
