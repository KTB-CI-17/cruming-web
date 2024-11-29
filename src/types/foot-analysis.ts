export interface FormData {
    shape: ShapeType;
    type: FootType;
    level: LevelType;
    footSize: string;
}

export type ShapeType = 'Egyptian' | 'Roman' | 'Greek';
export type FootType = 'narrow' | 'normal' | 'wide';
export type LevelType = 'elite' | 'advanced' | 'intermediate' | 'beginner';

export interface OptionType<T extends string> {
    id: T;
    label: string;
}

export interface ShoeData {
    id: number;
    modelName: {
        ko: string;
        en: string;
    };
    size: string;
    productUrl: string;
    imageUrl: string;
}

export interface ShoeCardProps {
    modelName: {
        ko: string;
        en: string;
    };
    size: string;
    productUrl: string;
    imageUrl: string;
}