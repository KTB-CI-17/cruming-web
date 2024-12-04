import {OptionType, ShapeType, FootType, LevelType, ShoeData} from '../types/foot-analysis';

export const SHAPE_OPTIONS: OptionType<ShapeType>[] = [
    { id: 'Egyptian', label: 'Egyptian' },
    { id: 'Roman', label: 'Roman' },
    { id: 'Greek', label: 'Greek' },
];

export const TYPE_OPTIONS: OptionType<FootType>[] = [
    { id: 'narrow', label: '좁음' },
    { id: 'normal', label: '보통' },
    { id: 'wide', label: '넓음' },
];

export const LEVEL_OPTIONS: OptionType<LevelType>[] = [
    { id: 'elite', label: '엘리트' },
    { id: 'advanced', label: '고급' },
    { id: 'intermediate', label: '중급' },
    { id: 'beginner', label: '초급' },
];

export const DUMMY_RESULTS: ShoeData[] = [
    {
        id: 1,
        modelName: {
            ko: "스카르파 인스팅트 VS 여성용",
            en: "SCARPA INSTINCT VS WOMEN'S"
        },
        size: "EU 42",
        productUrl: "https://rockrun.com/ko/collections/climbing-shoes/products/scarpa-instinct-vs-womens?variant=15957440462942",
        imageUrl: "https://rockrun.com/cdn/shop/products/scarpa-instinct-vs-womens_600x.png?v=1671190209"
    },
    {
        id: 2,
        modelName: {
            ko: "스카르파 드라고 LV 암벽화",
            en: "SCARPA DRAGO LV"
        },
        size: "EU 41",
        productUrl: "https://rockrun.com/ko/collections/climbing-shoes/products/scarpa-drago-lv",
        imageUrl: "https://rockrun.com/cdn/shop/products/scarpa-instinct-vs-womens_600x.png?v=1671190209"
    },
    {
        id: 3,
        modelName: {
            ko: "라스포티바 솔루션 컴프 여성용",
            en: "LA SPORTIVA SOLUTION COMP WOMEN'S"
        },
        size: "EU 40.5",
        productUrl: "https://rockrun.com/ko/collections/climbing-shoes/products/la-sportiva-solution-comp-womens",
        imageUrl: "https://rockrun.com/cdn/shop/products/scarpa-instinct-vs-womens_600x.png?v=1671190209"
    },
];