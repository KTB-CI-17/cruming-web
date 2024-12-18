import {LocationData} from "./location";
import {UploadImage} from "./community";

export type VisibilityType = '전체 공개' | '팔로워 공개' | '나만보기';

export interface TimelineFormData {
    location: LocationData | null;
    activityAt: string;
    level: string;
    content: string;
    visibility: VisibilityType;
    images: UploadImage[];
}

export interface TimelineRequest {
    location: LocationData;
    activityAt: string;
    level: string;
    content: string;
    visibility: string;
    fileRequests: Array<{
        originalFileName: string;
        displayOrder: number;
    }>;
}

export interface ColorLevelOption {
    color: string;
    label: string;
    value: string;
}

export interface TimelineDetailResponse {
    id: number;
    content: string;
    level: string;
    location: string;
    activityAt: string;
    userProfileImage: string;
    userId: number;
    userNickname: string;
    isWriter: boolean;
    instagram_id: string;
    visibility: VisibilityType;
    files: string[];
    likeCount: number;
    replyCount: number;
    isLiked: boolean;
}

export interface TimelineListResponse {
    id: number;
    content: string;
    level: string;
    location: string;
    activityAt: string;
    userId: number;
    userNickname: string;
    isWriter: boolean;
    file: string;
}

export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
}

export type TimelinePageResponse = PageResponse<TimelineListResponse>;

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
