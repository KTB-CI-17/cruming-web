export interface Timeline {
    id: number;
    title: string;
    subtitle: string;
    date: string;
    imageUrl: string;
    color: string;
}

export interface APIResponse {
    timelines: Timeline[];
    meta: {
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
    };
}

export type PrivacyType = '전체 공개' | '팔로워 공개' | '나만보기';

export interface TimelineFormData {
    location: string;
    activityDate: string;
    level: string;
    content: string;
    images: string[];
    privacy: PrivacyType;
}

export interface ColorLevelOption {
    color: string;
    label: string;
    value: string;
}

export const colorLevelOptions: ColorLevelOption[] = [
    { color: '#FF4747', label: '빨강', value: '#FF4747' },
    { color: '#FF8A3D', label: '주황', value: '#FF8A3D' },
    { color: '#FFD43D', label: '노랑', value: '#FFD43D' },
    { color: '#B4E233', label: '초록', value: '#B4E233' },
    { color: '#69DB7C', label: '연두', value: '#69DB7C' },
    { color: '#38D9A9', label: '하늘', value: '#38D9A9' },
    { color: '#4DABF7', label: '남색', value: '#4DABF7' },
    { color: '#748FFC', label: '보라', value: '#748FFC' },
    { color: '#E599F7', label: '핑크', value: '#E599F7' },
    { color: '#CED4DA', label: '흰색', value: '#FAFAFA' },
    { color: '#495057', label: '회색', value: '#495057' },
    { color: '#212529', label: '검정', value: '#212529' },
];