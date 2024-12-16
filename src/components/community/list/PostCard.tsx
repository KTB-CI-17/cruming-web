import React from 'react';
import { ListPost } from '../../../types/community';

interface PostCardProps {
    post: ListPost;
    onClick: (id: number) => void;
}

export function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = minute * 60;

    if (diff < minute) {
        return '방금 전';
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        return `${minutes}분 전`;
    } else if (diff < hour * 23) {
        const hours = Math.floor(diff / hour);
        return `${hours}시간 전`;
    } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        try {
            return formatTimeAgo(dateString);
        } catch (error) {
            console.error('Date parsing error:', error);
            return dateString;
        }
    };

    return (
        <button
            onClick={() => onClick(post.id)}
            className="w-full py-3 border-b border-[#F0F0F0] text-left"
        >
            <div className="flex items-center gap-2">
                <div className="flex items-center min-w-0 flex-1">
                    {post.isHot && (
                        <span className="flex-shrink-0 mr-2 text-base">🔥</span>
                    )}
                    {post.isNew && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 mr-2 text-xs font-semibold text-white bg-[#826CF6] rounded">
                            NEW
                        </span>
                    )}
                    <h3 className="truncate text-base text-[#333333]">
                        {post.title}
                    </h3>
                </div>
                <span className="flex-shrink-0 text-sm text-[#8F9BB3]">
                    {formatDate(post.createdAt)}
                </span>
            </div>
        </button>
    );
};

export default PostCard;
