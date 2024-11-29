import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post } from '../types/community';
import { usePostDetail } from '../hooks/usePostDetail';
import { useReplyState } from '../hooks/useReplyState';
import PostHeader from "../components/community/detail/PostHeader.tsx";
import PostContent from "../components/community/detail/PostContent.tsx";
import PostImageSlider from "../components/community/detail/PostImageSlider.tsx";
import PostActions from "../components/community/detail/PostActions.tsx";
import PostReply from "../components/community/detail/PostReply.tsx";
import PostReplyInput from "../components/community/detail/PostReplyInput.tsx";

export default function CommunityDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesCache, setImagesCache] = useState<{[key: string]: string}>({});
    const [totalReplyCount, setTotalReplyCount] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    const postService = usePostDetail();
    const { state: replyState, actions: replyActions } = useReplyState(id || '');

    const fetchPost = async () => {
        try {
            setIsLoading(true);
            if (!id) return;
            const data = await postService.fetchPost(id);
            setPost(data);
            const repliesResponse = await replyActions.fetchReplies();
            setTotalReplyCount(repliesResponse.totalElements);
        } catch (error) {
            setError("게시글을 불러오는데 실패했습니다.");
            if (window.confirm("게시글을 불러오는데 실패했습니다.")) {
                navigate(-1);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostAction = (action: 'delete' | 'edit') => {
        if (!post) return;

        if (action === 'delete') {
            if (window.confirm('활동 기록을 삭제하시겠습니까?')) {
                deletePost(post.id);
            }
        } else if (action === 'edit') {
            // 수정 기능 구현
        }
    };

    const deletePost = async (postId: number) => {
        try {
            await postService.deletePost(postId);
            alert("활동 기록이 삭제되었습니다.");
            navigate(-1);
        } catch (error) {
            alert("삭제에 실패했습니다.");
        }
    };

    const handleLike = async () => {
        if (!post) return false;
        try {
            const isLiked = await postService.togglePostLike(post.id);
            setPost(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    isLiked,
                    likeCount: isLiked ? prev.likeCount + 1 : prev.likeCount - 1
                };
            });
            return isLiked;
        } catch (error) {
            alert("좋아요 처리에 실패했습니다.");
            return false;
        }
    };

    const handleShare = async () => {
        alert("공유하기 기능이 준비 중입니다.");
    };

    const handleSubmitReply = async () => {
        if (!replyState.replyText.trim() || replyState.isSubmitting) return;

        try {
            if (replyState.editingReplyId) {
                await replyActions.updateReply(replyState.editingReplyId, replyState.replyText.trim());
            } else {
                await replyActions.createReply(replyState.replyText.trim(), replyState.selectedReplyId);
                setTotalReplyCount(prev => prev + 1);
                setPost(prevPost => {
                    if (!prevPost) return null;
                    return {
                        ...prevPost,
                        replyCount: prevPost.replyCount + 1
                    };
                });
            }
        } catch (error: any) {
            alert(error.message || "댓글 작성에 실패했습니다.");
        }
    };

    const handleDeleteReply = async (replyId: number) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

        try {
            await replyActions.deleteReply(replyId);
            setTotalReplyCount(prev => prev - 1);
            setPost(prevPost => {
                if (!prevPost) return null;
                return {
                    ...prevPost,
                    replyCount: prevPost.replyCount - 1
                };
            });
        } catch (error) {
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    useEffect(() => {
        const loadImages = async () => {
            if (!post) return;
            // 이미지 캐싱 로직 구현 필요
            const cache = post.files.reduce((acc, file) => ({
                ...acc,
                [file.url]: file.url
            }), {});
            setImagesCache(cache);
        };

        loadImages();
    }, [post]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white min-h-screen" ref={listRef}>
            <PostHeader
                post={post}
                onProfilePress={(userId) => navigate(`/profile/${userId}`)}
                onMorePress={() => {
                    if (window.confirm('게시글을 삭제하시겠습니까?')) {
                        handlePostAction('delete');
                    }
                }}
            />

            <PostContent post={post} />

            <PostImageSlider
                files={post.files}
                imagesCache={imagesCache}
                onImageIndexChange={setCurrentImageIndex}
            />

            <PostActions
                post={post}
                replyCount={totalReplyCount}
                onLike={handleLike}
                onShare={handleShare}
                onReply={() => listRef.current?.scrollIntoView({ behavior: 'smooth' })}
            />

            <PostReply
                replies={replyState.replies}
                onLoadMore={() => replyActions.fetchReplies(Math.ceil(replyState.replies.length / 10))}
                hasMore={!replyState.error}
                loading={replyState.isSubmitting}
                onReply={replyActions.selectReply}
                onProfilePress={(userId) => navigate(`/profile/${userId}`)}
                onDeleteReply={handleDeleteReply}
                onEditReply={replyActions.setEditing}
                onLoadChildren={replyActions.fetchChildReplies}
                totalCount={totalReplyCount}
            />

            <PostReplyInput
                replyText={replyState.replyText}
                onReplyTextChange={replyActions.setReplyText}
                selectedReply={replyState.selectedReplyId ?
                    replyState.replies.find(r => r.id === replyState.selectedReplyId) || null
                    : null}
                onCancelReply={() => {
                    replyActions.selectReply(null);
                    replyActions.setEditing(null);
                    replyActions.setReplyText('');
                }}
                onSubmitReply={handleSubmitReply}
                isSubmitting={replyState.isSubmitting}
                isEditing={!!replyState.editingReplyId}
            />
        </div>
    );
}