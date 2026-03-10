import { Icon, Input, InputGroup, InputIcon } from '@/components/atomic';
import type { TextInputProps } from '@/types';

export function Search(props: TextInputProps<HTMLInputElement>) {
    return (
        <InputGroup>
            <Input {...props} />
            <InputIcon>
                <Icon.Search />
            </InputIcon>
        </InputGroup>
    );
}
