import { useState, useCallback } from 'react';
import { Timeline } from '../../types/timeline';
import {api} from "../../config/axios";

export function useTimelinePosts() {
    const [timelines, setTimelines] = useState<Timeline[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchMonthlyTimelines = useCallback(async (year: number, month: number) => {
        setIsLoading(true);
        try {
            const response = await api.get(`/timelines/monthly/${year}/${month}`);
            setTimelines(response.data.content || []);
        } catch (error) {
            console.error('Failed to fetch monthly timelines:', error);
            setTimelines([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    return {
        timelines,
        isLoading,
        isRefreshing,
        fetchMonthlyTimelines,
        setTimelines
    };
}