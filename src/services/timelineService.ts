import { api } from "../config/axios";
import { TimelineListResponse, TimelinePageResponse } from "../types/timeline";

export const timelineService = {
    getMonthlyTimelines: async (year: number, month: number, page: number = 0): Promise<TimelinePageResponse> => {
        const response = await api.get<TimelinePageResponse>(
            `/timelines/monthly/${year}/${month}`,
            {
                params: {
                    page,
                    size: 1
                }
            }
        );
        return response.data;
    },

    deleteTimeline: async (id: number): Promise<void> => {
        await api.delete(`/timelines/${id}`);
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