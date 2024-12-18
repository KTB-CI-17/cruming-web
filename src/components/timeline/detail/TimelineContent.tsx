import { EllipsisHorizontalIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { formatTimeAgo } from '../../../utils/formatTime';
import ProfileAvatar from '../../common/ProfileAvatar';
import {TimelineDetailResponse} from "../../../types/timeline";
import {Dot} from "../Dot";

interface PostHeaderContentProps {
    timeline: TimelineDetailResponse;
    onProfilePress: (userId: number) => void;
    onMorePress: () => void;
}

export default function PostContent({ timeline, onProfilePress, onMorePress }: PostHeaderContentProps) {
    return (
        <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">

                {timeline.level && (
                    <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg mt-4">
                        <Dot color={timeline.level} />
                    </div>
                )}

                {timeline.location && (
                    <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg mt-4">
                        <MapPinIcon className="w-5 h-5 text-gray-600" />
                        <span className="ml-2 text-sm text-gray-700">{timeline.location}</span>
                    </div>
                )}

                {timeline.isWriter && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMorePress();
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full shrink-0"
                    >
                        <EllipsisHorizontalIcon className="w-6 h-6 text-gray-600"/>
                    </button>
                )}
            </div>

            <div className="flex items-center gap-3">
            <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onProfilePress(timeline.userId)}
                >
                    <ProfileAvatar
                        userProfile={timeline.userProfileImage}
                        userNickname={timeline.userNickname}
                        userId={timeline.userId}
                        size="md"
                        onClick={() => onProfilePress(timeline.userId)}
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-base font-medium text-gray-900">{timeline.userNickname}</p>
                            {timeline.instagram_id && (
                                <span className="text-sm text-gray-500">@{timeline.instagram_id}</span>
                            )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <span>{formatTimeAgo(timeline.activityAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-base leading-relaxed">{timeline.content}</p>
            </div>
        </div>
    );
}