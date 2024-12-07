import React from 'react';
import { format, parseISO } from 'date-fns';
import { ListPost } from '../../../types/community';
import { ko } from "date-fns/locale";

interface PostCardProps {
    post: ListPost;
    onClick: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        try {
            return format(parseISO(dateString), 'yyyy. MM. dd', { locale: ko });
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