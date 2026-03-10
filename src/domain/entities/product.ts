import type { Unit } from '@/domain/utils';
import type { Macros } from './macros';

export type Product = Macros & {
    id: string;
    name: string;
    brand: string | null;
    comment: string | null;
    unit: Unit;
    piece: number | null;

    created_at?: number;
    updated_at?: number;
};
