import { useCallback } from 'react';
import {TimelineListResponse} from "../../types/timeline";

interface MarkedDates {
    [key: string]: {
        customStyles: {
            container: {
                borderBottomWidth: number;
                borderBottomColor: string;
            }
        }
    }
}

export function useTimelineCalendar(onMonthChange: (year: number, month: number) => void) {
    const handleMonthChange = useCallback((date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        onMonthChange(year, month);
    }, [onMonthChange]);

    const getMarkedDates = useCallback((timelines: TimelineListResponse[]): MarkedDates => {
        return timelines.reduce((acc, timeline) => ({
            ...acc,
            [timeline.activityAt]: {
                customStyles: {
                    container: {
                        borderBottomWidth: 2,
                        borderBottomColor: '#735BF2',
                    }
                }
            }
        }), {});
    }, []);

    return {
        handleMonthChange,
        getMarkedDates
    };
}