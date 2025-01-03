import { MoreVertical } from 'lucide-react';
import { Dot } from '../Dot';
import { TimelineListResponse } from "../../../types/timeline";
import mainLogo from '@/assets/logo.png';

interface TimelineCardProps {
    timeline: TimelineListResponse;
    onOptionsPress?: () => void;
    showOptions?: boolean;
    onClick?: () => void;
    className?: string;
}

export default function TimelineCard({
                                         timeline,
                                         onOptionsPress,
                                         showOptions = false,
                                         onClick,
                                         className = ''
                                     }: TimelineCardProps) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            window.location.href = `/timeline/${timeline.id}`;
        }
    };

    return (
        <div
            className={`bg-white rounded-xl shadow-md cursor-pointer mb-5 overflow-hidden ${className}`}
            onClick={handleClick}
        >
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Dot color={timeline.level} />
                    <span className="text-sm">{timeline.activityAt}</span>
                </div>

                {onOptionsPress === null || showOptions === false ? (
                    <span className="text-sm text-right">{timeline.userNickname}</span>
                ) : (
                    showOptions && onOptionsPress && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onOptionsPress();
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                    )
                )}
            </div>

            <div className="px-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {timeline.location}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {timeline.content}
                </p>
            </div>

            <div className="w-full h-[150px] bg-white flex items-center justify-center">
                <img
                    src={timeline.file || mainLogo}
                    alt={timeline.file || 'Default logo'}
                    className={`h-[150px] w-full ${timeline.file ? 'object-cover' : 'object-contain bg-white'}`}
                    style={{ objectPosition: timeline.file ? 'center' : '50% 50%' }}
                />
            </div>
        </div>
    );
}