import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePost } from "../../hooks/community/usePostDetail";
import { useReply } from "../../hooks/community/useReply";
import { Reply } from "../../types/community";
import PostContent from "../../components/community/detail/PostContent";
import PostImageSlider from "../../components/community/detail/PostImageSlider";
import PostReply from "../../components/community/detail/PostReply";
import PostActions from "../../components/community/detail/PostActions";
import PostReplyInput from "../../components/community/detail/PostReplyInput";
import { REPLY_PAGINATION } from "../../constants/replyPagination";
import MoreActionsMenu from "../../components/common/MoreActionsMenu";

export default function CommunityDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [imagesCache, setImagesCache] = useState<{[key: string]: string}>({});
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const {
        post,
        isLoading,
        error,
        fetchPost,
        deletePost,
        togglePostLike,
        incrementView
    } = usePost(id || '');

    const {
        state: replyState,
        actions: replyActions
    } = useReply(id || '');

    useEffect(() => {
        if (!id) {
            navigate('/community');
            return;
        }

        const loadData = async () => {
            try {
                await fetchPost();
                await replyActions.fetchReplies(0);

                const lastViewTime = localStorage.getItem(`post-${id}-view`);
                const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);

                if (!lastViewTime || parseInt(lastViewTime) < thirtyMinutesAgo) {
                    await incrementView();
                    localStorage.setItem(`post-${id}-view`, Date.now().toString());
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };

        loadData();
    }, [id]);

    useEffect(() => {
        const loadImages = async () => {
            if (!post) return;
            try {
                const imagePromises = post.files.map(async file => {
                    return { [file.url]: file.url };
                });

                const results = await Promise.all(imagePromises);
                setImagesCache(Object.assign({}, ...results));
            } catch (error) {
                console.error('Failed to load images:', error);
            }
        };

        loadImages();

        return () => {
            Object.values(imagesCache).forEach(url => {
                URL.revokeObjectURL(url);
            });
        };
    }, [post]);

    const handlePostAction = async (action: 'delete' | 'edit') => {
        if (action === 'delete') {
            if (window.confirm('게시글을 삭제하시겠습니까?')) {
                try {
                    await deletePost();
                    navigate(-1);
                } catch (error) {
                    console.error(error);
                    alert('삭제에 실패했습니다.');
                }
            }
        } else {
            navigate(`/community/edit/${id}`);
        }
    };

    const getSelectedReplyInfo = () => {
        if (!replyState.selectedReplyId) return null;
        return replyState.replies.reduce<Reply | null>((found, reply) => {
            if (found) return found;
            if (reply.id === replyState.selectedReplyId) return reply;
            return found;
        }, null);
    };

    const handleProfilePress = (userId: number) => {
        navigate(`/profile/${userId}`);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-full bg-white page-container">
                <div className="flex items-center justify-center flex-1">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex flex-col h-full bg-white page-container">
                <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-gray-600 mb-4">게시글을 불러올 수 없습니다.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        뒤로가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white page-container">
            <main className="flex-1 pb-[calc(var(--bottom-nav-height)+1rem)]">
                <PostContent
                    post={post}
                    onProfilePress={handleProfilePress}
                    onMorePress={() => setIsMoreMenuOpen(true)}
                />

                <PostImageSlider
                    files={post.files}
                    imagesCache={imagesCache}
                    onImageIndexChange={setCurrentImageIndex}
                />

                <PostActions
                    post={post}
                    onLike={togglePostLike}
                    onShare={() => alert('공유하기 기능이 준비 중입니다.')}
                    onReply={() => {
                        const replySection = document.getElementById('replies');
                        replySection?.scrollIntoView({behavior: 'smooth'});
                    }}
                />

                <div id="replies">
                    <PostReply
                        replies={replyState.replies}
                        onLoadMore={() => replyActions.fetchReplies(
                            Math.ceil(replyState.replies.length / REPLY_PAGINATION.REPLIES_PER_PAGE)
                        )}
                        hasMore={replyState.hasMore}
                        loading={replyState.isSubmitting}
                        onReply={replyActions.selectReply}
                        onProfilePress={handleProfilePress}
                        onLoadChildren={replyActions.fetchChildReplies}
                        onDeleteReply={replyActions.deleteReply}
                        onEditReply={replyActions.setEditing}
                        totalCount={replyState.totalCount}
                        loadingStates={replyState.loadingStates}
                        childrenMap={replyState.childrenMap}
                        childrenHasMore={replyState.childrenHasMore}
                    />
                </div>

                {post.isWriter && (
                    <MoreActionsMenu
                        isOpen={isMoreMenuOpen}
                        onClose={() => setIsMoreMenuOpen(false)}
                        onEdit={() => handlePostAction('edit')}
                        onDelete={() => handlePostAction('delete')}
                    />
                )}
            </main>

            <div className="fixed bottom-[var(--bottom-nav-height)] left-0 right-0 max-w-[var(--mobile-max-width)] mx-auto bg-white border-t">
                <PostReplyInput
                    replyText={replyState.replyText}
                    onReplyTextChange={replyActions.setReplyText}
                    selectedReply={getSelectedReplyInfo()}
                    onCancelReply={() => {
                        replyActions.selectReply(null);
                        replyActions.setEditing(null);
                        replyActions.setReplyText('');
                    }}
                    onSubmitReply={() => {
                        if (replyState.editingReplyId) {
                            return replyActions.updateReply(
                                replyState.editingReplyId,
                                replyState.replyText.trim()
                            );
                        }
                        return replyActions.createReply(
                            replyState.replyText.trim(),
                            replyState.selectedReplyId
                        );
                    }}
                    isSubmitting={replyState.isSubmitting}
                    isEditing={!!replyState.editingReplyId}
                />
            </div>
        </div>
    );
}