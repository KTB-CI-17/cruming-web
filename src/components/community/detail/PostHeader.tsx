import {Post} from "../../../types/community.ts";
import {EllipsisHorizontalIcon} from "@heroicons/react/24/outline";


interface PostHeaderProps {
    post: Post;
    onProfilePress: (userId: number) => void;
    onMorePress: () => void;
}

export default function PostHeader({ post, onProfilePress, onMorePress }: PostHeaderProps) {
    return (
        <div
            className="flex items-center justify-between px-4 py-4 cursor-pointer"
            onClick={() => onProfilePress(post.userId)}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <img
                        src="/images/default-profile.png"
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <p className="text-base font-bold text-gray-900">{post.userNickname}</p>
                    {post.instagram_id && (
                        <p className="text-sm text-gray-600">@{post.instagram_id}</p>
                    )}
                </div>
            </div>
            {post.isWriter && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onMorePress();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <EllipsisHorizontalIcon className="w-6 h-6 text-gray-600" />
                </button>
            )}
        </div>
    );
}