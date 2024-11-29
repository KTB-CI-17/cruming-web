import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';
import ErrorState from './ErrorState';
import { usePostList } from '../../hooks/usePostList';

const GeneralTab = () => {
    const navigate = useNavigate();
    const {
        posts,
        isLoading,
        error,
        hasMore,
        handleLoadMore,
        handleRetry
    } = usePostList({ category: 'GENERAL' });

    const handlePostClick = useCallback((id: number) => {
        navigate(`/community/${id}`);
    }, [navigate]);

    if (isLoading && posts.length === 0) {
        return <div className="p-4 text-center">로딩 중...</div>;
    }

    if (error) {
        return <ErrorState onRetry={handleRetry} />;
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
                <p className="text-[#8F9BB3] text-base">게시글이 존재하지 않습니다.</p>
            </div>
        );
    }

    return (
        <div>
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    onClick={handlePostClick}
                />
            ))}
            {hasMore && (
                <div className="p-4 text-center">
                    <button
                        onClick={handleLoadMore}
                        className="text-[#8F9BB3]"
                    >
                        더 보기
                    </button>
                </div>
            )}
        </div>
    );
};

export default GeneralTab;