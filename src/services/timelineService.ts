import { api } from "../config/axios";
import { Timeline } from "../types/timeline";

interface TimelineResponse {
    content: Timeline[];
}

export const timelineService = {
    getMonthlyTimelines: async (year: number, month: number): Promise<Timeline[]> => {
        const response = await api.get<TimelineResponse>(`/timelines/monthly/${year}/${month}`);
        return response.data.content || [];
    },

    deleteTimeline: async (id: number): Promise<void> => {
        await api.delete(`/timelines/${id}`);
    },

    createTimeline: async (data: Omit<Timeline, "id">): Promise<Timeline> => {
        const response = await api.post<Timeline>('/timelines', data);
        return response.data;
    },

    updateTimeline: async (id: number, data: Partial<Timeline>): Promise<Timeline> => {
        const response = await api.put<Timeline>(`/timelines/${id}`, data);
        return response.data;
    }
};