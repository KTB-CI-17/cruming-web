import { Post } from '../../../types/community';
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { formatTimeAgo } from '../../../utils/formatTime';

interface PostHeaderContentProps {
    post: Post;
    onProfilePress: (userId: number) => void;
    onMorePress: () => void;
}

// 사용자 ID를 기반으로 일관된 색상을 반환하는 함수
const getBackgroundColor = (userId: number) => {
    const colors = [
        'bg-red-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500'
    ];
    return colors[userId % colors.length];
};

export default function PostContent({ post, onProfilePress, onMorePress }: PostHeaderContentProps) {
    // 닉네임의 첫 글자를 가져오는 함수
    const getInitial = (nickname: string) => {
        return nickname.charAt(0).toUpperCase();
    };

    return (
        <div className="px-4 py-4">
            {/* Title and more options */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-medium pr-2 flex-1">{post.title}</h1>
                {post.isWriter && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMorePress();
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full shrink-0"
                    >
                        <EllipsisHorizontalIcon className="w-6 h-6 text-gray-600" />
                    </button>
                )}
            </div>

            {/* Profile section */}
            <div className="flex items-center gap-3">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onProfilePress(post.userId)}
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        {post.userProfile ? (
                            <img
                                src={post.userProfile}
                                alt={`${post.userNickname}님의 프로필`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center text-white ${getBackgroundColor(post.userId)}`}>
                                <span className="text-lg font-medium">
                                    {getInitial(post.userNickname)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-base font-medium text-gray-900">{post.userNickname}</p>
                            {post.instagram_id && (
                                <span className="text-sm text-gray-500">@{post.instagram_id}</span>
                            )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <span>{formatTimeAgo(post.createdAt)}</span>
                            <span>·</span>
                            <span>조회 {post.views}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post content */}
            <div className="mt-4">
                <p className="text-base leading-relaxed">{post.content}</p>
            </div>
        </div>
    );
}