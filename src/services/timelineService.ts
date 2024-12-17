import { api } from "../config/axios";
import { TimelineListResponse, TimelinePageResponse } from "../types/timeline";

export const timelineService = {
    getMonthlyTimelines: async (year: number, month: number, page: number = 0): Promise<TimelinePageResponse> => {
        const response = await api.get<TimelinePageResponse>(
            `/timelines/monthly/${year}/${month}`,
            {
                params: {
                    page,
                    size: 10
                }
            }
        );
        return response.data;
    },

    getSelfTimelines: async (page: number = 0): Promise<TimelinePageResponse> => {
        const response = await api.get<TimelinePageResponse>(
            `/timelines/me`,
            {
                params: {
                    page,
                    size: 10
                }
            }
        );
        return response.data;
    },

    getUserTimelines: async (userId: number, page: number = 0): Promise<TimelinePageResponse> => {
        const response = await api.get<TimelinePageResponse>(
            `/timelines/users/${userId}`,
            {
                params: {
                    page,
                    size: 10
                }
            }
        );
        return response.data;
    },

    deleteTimeline: async (id: number): Promise<void> => {
        await api.delete(`/timelines/${id}`);
    },

    getActivityDates: async (year: number, month: number): Promise<string[]> => {
        const response = await api.get<string[]>(`/timelines/activity/${year}/${month}`);
        return response.data;
    },

    createTimeline: async (data: Omit<TimelineListResponse, "id">): Promise<TimelineListResponse> => {
        const response = await api.post<TimelineListResponse>('/timelines', data);
        return response.data;
    },

    updateTimeline: async (id: number, data: Partial<TimelineListResponse>): Promise<TimelineListResponse> => {
        const response = await api.put<TimelineListResponse>(`/timelines/${id}`, data);
        return response.data;
    }
};