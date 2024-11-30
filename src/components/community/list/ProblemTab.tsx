import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import PostCard from './PostCard.tsx';
import ErrorState from './ErrorState.tsx';
import { usePostList } from '../../../hooks/usePostList.ts';

const GeneralTab = () => {
    const navigate = useNavigate();
    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const {
        posts,
        isLoading,
        error,
        hasMore,
        handleLoadMore,
        handleRetry
    } = usePostList({ category: 'PROBLEM' });

    const handlePostClick = useCallback((id: number) => {
        navigate(`/community/${id}`);
    }, [navigate]);

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            handleLoadMore();
        }
    }, [inView, hasMore, isLoading, handleLoadMore]);

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
            {hasMore ? (
                <div
                    ref={ref}
                    className="p-4 text-center"
                >
                    <div className="text-[#8F9BB3]">로딩 중...</div>
                </div>
            ) : posts.length > 0 && (
                <div className="p-1 border rounded-lg mb-4 bg-white shadow-sm">
                    <div className="flex items-center justify-center py-1">
                        <p className="text-[#8F9BB3] text-base">
                            모든 게시글을 확인하셨습니다.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneralTab;