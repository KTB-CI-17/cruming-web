import {
    ChatBubbleLeftIcon,
    HeartIcon as HeartIconOutline,
    ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import {TimelineDetailResponse} from "../../../types/timeline";

interface TimelineActionsProps {
    timeline: TimelineDetailResponse;
    onLike: () => Promise<boolean>;
    onShare: () => void;
    onReply: () => void;
}

export default function TimelineActions({ timeline, onLike, onShare, onReply }: TimelineActionsProps) {
    return (
        <div className="flex items-center px-4 py-4 border-t border-gray-100">
            <button
                onClick={onReply}
                className="flex items-center gap-1 mr-4"
            >
                <ChatBubbleLeftIcon className="w-6 h-6 text-gray-600" />
                {timeline.replyCount > 0 && (
                    <span className="text-sm text-gray-600">{timeline.replyCount}</span>
                )}
            </button>

            <button
                onClick={onLike}
                className="flex items-center gap-1 mr-4"
            >
                {timeline.isLiked ? (
                    <HeartIconSolid className="w-6 h-6 text-red-500" />
                ) : (
                    <HeartIconOutline className="w-6 h-6 text-gray-600" />
                )}
                {timeline.likeCount > 0 && (
                    <span className="text-sm text-gray-600">{timeline.likeCount}</span>
                )}
            </button>

            <button
                onClick={onShare}
                className="flex items-center gap-1"
            >
                <ShareIcon className="w-6 h-6 text-gray-600" />
            </button>
        </div>
    );
}