import TimelineList from "../../timeline/TimelineList";
import {useCommunityTimeline} from "../../../hooks/timeline/useCommunityTimeline";
import {useEffect} from "react";

const TimelineTab = () => {
    const {
        timelines,
        isLoading: timelineLoading,
        isRefreshing,
        hasMore,
        fetchNextPage,
        fetchTimelines
    } = useCommunityTimeline();

    useEffect(() => {
        fetchTimelines();
    }, [fetchTimelines]);

    return (
        <div className="max-w-screen-sm mx-auto w-full pt-6">
            <div className="flex flex-col gap-6">
                <TimelineList
                    timelines={timelines || []}
                    isLoading={timelineLoading}
                    isRefreshing={isRefreshing}
                    hasMore={hasMore}
                    onLoadMore={fetchNextPage}
                />
            </div>
        </div>
    );
};

export default TimelineTab;