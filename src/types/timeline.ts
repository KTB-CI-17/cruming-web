import {LocationData} from "./location";
import {UploadImage} from "./community";
import { Page } from './common';

export type VisibilityType = '전체 공개' | '팔로워 공개' | '나만보기';

export type ServerVisibilityType = 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';

export const visibilityMapper = {
    toServer: (type: VisibilityType): ServerVisibilityType => {
        const map: Record<VisibilityType, ServerVisibilityType> = {
            '전체 공개': 'PUBLIC',
            '팔로워 공개': 'FOLLOWERS',
            '나만보기': 'PRIVATE',
        };
        return map[type];
    },
};

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

export interface BaseTimeline {
    id: number;
    content: string;
    createdAt: string;
}

export interface TimelineFile {
    id: number;
    fileName: string;
    fileKey: string;
    url: string;
    fileType: string;
    fileSize: number;
    displayOrder: number;
    userId: number;
    status: string;
    createdAt: string;
}

export interface Timeline extends BaseTimeline {
    level: string;
    location: LocationData;
    userId: number;
    userNickname: string;
    userProfile: string;
    isWriter: boolean;
    files: TimelineFile[];
    isLiked: boolean;
    likeCount: number;
    replyCount: number;
    visibility: ServerVisibilityType;
    activityAt: string;
}

export interface TimelineUser {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
}

export interface TimelineResponse {
    id: number;
    user: TimelineUser;
    location: LocationData;
    level: string;
    content: string;
    visibility: ServerVisibilityType;
    activityAt: string;
    likeCount: number;
    replyCount: number;
    isLiked: boolean;
    createdAt: string;
    files: TimelineFile[];
}

export interface TimelineListResponse {
    id: number;
    content: string;
    level: string;
    location: LocationData;
    createdAt: string;
    userId: number;
    userNickname: string;
    isWriter: boolean;
    files: TimelineFile[];
}

export interface TimelineReplyResponse {
    id: number;
    user: TimelineUser;
    content: string;
    children: TimelineReplyResponse[];
    createdAt: string;
    updatedAt: string;
    isWriter: boolean;
}

export interface TimelineReplyRequest {
    content: string;
    parentId?: number;
}

export type TimelinePageResponse = Page<TimelineListResponse>;
