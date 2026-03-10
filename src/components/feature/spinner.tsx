import { Icon } from '@/components/atomic';

export function Spinner() {
    return (
        <div className="h-full w-full flex-1 justify-center items-center flex animate-in fade-in duration-100">
            <Icon.Spinner className="animate-in repeat-infinite spin-in-360 duration-700 ease-linear text-muted-foreground size-[40%]" />
        </div>
    );
}
