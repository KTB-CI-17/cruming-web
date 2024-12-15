import { useState } from 'react';
import { timelineService } from '../../services/timelineService';

export function useTimelineCRUD() {
    const [selectedTimelineId, setSelectedTimelineId] = useState<number | null>(null);

    const deleteTimeline = async (id: number) => {
        try {
            await timelineService.deleteTimeline(id);
            return true;
        } catch (error) {
            console.error('Failed to delete timeline:', error);
            return false;
        }
    };

    const handleTimelineAction = async (id: number, action: 'edit' | 'delete') => {
        if (action === 'delete') {
            if (window.confirm('활동 기록을 삭제하시겠습니까?')) {
                const success = await deleteTimeline(id);
                if (success) {
                    alert('삭제되었습니다.');
                    return true;
                } else {
                    alert('삭제에 실패했습니다. 다시 시도해주세요.');
                }
            }
        } else if (action === 'edit') {
            alert('수정 기능은 준비 중입니다.');
        }
        return false;
    };

    return {
        selectedTimelineId,
        setSelectedTimelineId,
        handleTimelineAction
    };
}