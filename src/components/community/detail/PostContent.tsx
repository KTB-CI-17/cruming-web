import { Post } from '../../../types/community';
import { MapPinIcon, BoltIcon } from '@heroicons/react/24/outline';

interface PostContentProps {
    post: Post;
}

function PostLocation({ location }: { location?: string }) {
    if (!location) return null;

    return (
        <div className="flex items-center px-4 py-3 bg-gray-50 mx-4 mb-4 rounded-lg">
            <MapPinIcon className="w-[18px] h-[18px] text-gray-600 shrink-0" />
            <p className="ml-2 text-sm text-gray-700 truncate">{location}</p>
        </div>
    );
}

function PostLevel({ level }: { level?: string }) {
    if (!level) return null;

    return (
        <div className="flex items-center px-4 py-3 bg-gray-50 mx-4 mb-4 rounded-lg">
            <BoltIcon className="w-[18px] h-[18px] text-gray-600 shrink-0" />
            <p className="ml-2 text-sm text-gray-700 truncate">{level}</p>
        </div>
    );
}

export default function PostContent({ post }: PostContentProps) {
    return (
        <>
            <h1 className="text-lg font-medium px-4">{post.title}</h1>
            <PostLocation location={post.location} />
            <PostLevel level={post.level} />
            <p className="text-base leading-relaxed px-4">{post.content}</p>
        </>
    );
}