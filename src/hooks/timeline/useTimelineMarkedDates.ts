import { useState, useCallback } from 'react';
import { timelineService } from '../../services/timelineService';

export function useTimelineMarkedDates() {
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
    const [isLoadingDates, setIsLoadingDates] = useState(false);

    const fetchMarkedDates = useCallback(async (year: number, month: number) => {
        setIsLoadingDates(true);
        try {
            const dates = await timelineService.getActivityDates(year, month);
            const newMarkedDates = dates.reduce((acc, date) => ({
                ...acc,
                [date]: {
                    marked: true,
                    customStyles: {
                        container: {
                            borderBottomWidth: 2,
                            borderBottomColor: '#735BF2',
                        }
                    }
                }
            }), {});
            setMarkedDates(newMarkedDates);
        } catch (error) {
            console.error('Failed to fetch activity dates:', error);
            setMarkedDates({});
        } finally {
            setIsLoadingDates(false);
        }
    }, []);

    return {
        markedDates,
        isLoadingDates,
        fetchMarkedDates
    };
}