import { MoreVertical } from 'lucide-react';
import { Timeline } from '../../types/timeline';
import { Dot } from './Dot';

interface TimelineCardProps {
    timeline: Timeline;
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
                {showOptions && onOptionsPress && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOptionsPress();
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                )}
            </div>

            <div className="px-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {timeline.content}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {timeline.location?.placeName}
                </p>
            </div>

            {timeline.files && timeline.files.length > 0 && (
                <img
                    src={timeline.files[0].url}
                    alt={timeline.content}
                    className="w-full h-[150px] object-cover"
                />
            )}
        </div>
    );
}