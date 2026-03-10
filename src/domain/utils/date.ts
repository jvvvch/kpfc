import { startOfDay } from 'date-fns';

export enum DayPosition {
    past = 'past',
    current = 'current',
    future = 'future',
}

export const getDayPosition = (date: Date | number) => {
    const day = startOfDay(new Date(date)).getTime();
    const currentDay = startOfDay(new Date()).getTime();

    if (day < currentDay) {
        return DayPosition.past;
    }
    if (day > currentDay) {
        return DayPosition.future;
    }
    return DayPosition.current;
};
