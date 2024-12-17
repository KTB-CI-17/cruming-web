import { api, multipartApi } from "../config/axios";
import { Timeline, TimelineRequest, TimelineResponse, TimelineListResponse, TimelineReplyResponse } from "../types/timeline";
import { Page } from '../types/common';

export const timelineService = {
    // 타임라인 생성
    createTimeline: async (request: TimelineRequest, files?: File[]): Promise<TimelineResponse> => {
        // 파일이 없는 경우
        if (!files || files.length === 0) {
            const response = await api.post<TimelineResponse>('/timelines', request);
            return response.data;
        }

        // 파일이 있는 경우
        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
        
        files.forEach(file => formData.append('files', file));

        const response = await multipartApi.post<TimelineResponse>('/timelines', formData);
        return response.data;
    },

    // 타임라인 삭제
    deleteTimeline: async (timelineId: number): Promise<void> => {
        await api.delete(`/timelines/${timelineId}`);
    },

    // 타임��인 좋아요 토글
    toggleTimelineLike: async (timelineId: number): Promise<boolean> => {
        const response = await api.post<boolean>(`/timelines/${timelineId}/likes/toggle`);
        return response.data;
    },

    // 타임라인 댓글 작성
    createReply: async (timelineId: number, content: string, parentId?: number): Promise<TimelineReplyResponse> => {
        const url = `/timelines/${timelineId}/replies`;
        const response = await api.post<TimelineReplyResponse>(url, { content, parentId });
        return response.data;
    },

    // 용자 타임라인 조회
    getUserTimelines: async (userId: number, page = 0, size = 10) => {
        const response = await api.get<Page<TimelineListResponse>>(`/timelines/users/${userId}`, {
            params: { page, size }
        });
        return response.data;
    },

    // 타임라인 상세 조회
    getTimelineDetail: async (timelineId: number): Promise<TimelineResponse> => {
        const response = await api.get<TimelineResponse>(`/timelines/${timelineId}/detail`);
        return response.data;
    },

    // 타임라인 댓글 조회
    getTimelineReplies: async (timelineId: number, page = 0, size = 10) => {
        const response = await api.get<Page<TimelineReplyResponse>>(`/timelines/${timelineId}/replies`, {
            params: { page, size }
        });
        return response.data;
    },

    // 팔로잉 타임라인 조회
    getFollowingTimelines: async (page = 0, size = 10) => {
        const response = await api.get<Page<TimelineListResponse>>('/timelines/following', {
            params: { page, size }
        });
        return response.data;
    },

    // 월별 타임라인 조회
    getMonthlyTimelines: async (year: number, month: number): Promise<TimelineListResponse[]> => {
        const response = await api.get<TimelineListResponse[]>(`/timelines/monthly/${year}/${month}`);
        return response.data;
    },

    // 일별 타임라인 조회
    getDailyTimelines: async (year: number, month: number, day: number): Promise<TimelineListResponse[]> => {
        const response = await api.get<TimelineListResponse[]>(`/timelines/daily/${year}/${month}/${day}`);
        return response.data;
    }
};
