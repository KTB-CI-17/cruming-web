import { useState, useCallback } from 'react';
import { TimelineListResponse } from "../../types/timeline";
import {api} from "../../config/axios";

export function useTimelinePosts() {
    const [timelines, setTimelines] = useState<TimelineListResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchMonthlyTimelines = useCallback(async (year: number, month: number) => {
        try {
            setIsLoading(true);
            const response = await api.get<TimelineListResponse[]>(
                `/timelines/monthly`, {
                    params: {
                        year,
                        month
                    }
                }
            );
            setTimelines(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Failed to fetch timelines:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshTimelines = useCallback(async (year: number, month: number) => {
        try {
            setIsRefreshing(true);
            const response = await api.get<TimelineListResponse[]>(
                `/timelines/monthly`, {
                    params: {
                        year,
                        month
                    }
                }
            );
            setTimelines(response.data);
        } catch (error) {
            console.error('Failed to refresh timelines:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    return {
        timelines,
        isLoading,
        isRefreshing,
        fetchMonthlyTimelines,
        refreshTimelines,
        setTimelines
    };
}