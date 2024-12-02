import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {usePost} from "../../hooks/usePostDetail.ts";
import {useReply} from "../../hooks/useReply.ts";
import {api} from "../../config/axios.ts";
import {Reply} from "../../types/community.ts";
import PostContent from "../../components/community/detail/PostContent.tsx";
import PostImageSlider from "../../components/community/detail/PostImageSlider.tsx";
import PostReply from "../../components/community/detail/PostReply.tsx";
import PostActions from "../../components/community/detail/PostActions.tsx";
import PostReplyInput from "../../components/community/detail/PostReplyInput.tsx";
import {REPLY_PAGINATION} from "../../../constants/replyPagination.ts";

export default function CommunityDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [imagesCache, setImagesCache] = useState<{[key: string]: string}>({});


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

        // 게시글과 댓글 동시에 로딩
        const loadData = async () => {
            try {
                await fetchPost();
                await replyActions.fetchReplies(0);

                // 로컬 스토리지에서 최근 조회 시간 확인
                const lastViewTime = localStorage.getItem(`post-${id}-view`);
                const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);

                // 30분 이내 조회 기록이 없으면 조회수 증가
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
                    const response = await api.get(`${file.url}`, { responseType: 'blob' });
                    const imageUrl = URL.createObjectURL(response.data);
                    return { [file.url]: imageUrl };
                });

                const results = await Promise.all(imagePromises);
                setImagesCache(Object.assign({}, ...results));
            } catch (error) {
                console.error('Failed to load images:', error);
            }
        };

        loadImages();

        // Cleanup function to revoke object URLs
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

    const showActionSheet = () => {
        // 웹에서는 드롭다운 메뉴로 구현
        const menu = document.createElement('div');
        menu.className = 'absolute right-4 top-16 bg-white shadow-lg rounded-lg overflow-hidden z-50';
        menu.innerHTML = `
            <button class="w-full px-4 py-2 text-left hover:bg-gray-100">수정</button>
            <button class="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600">삭제</button>
        `;
        document.body.appendChild(menu);

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.textContent === '수정') {
                handlePostAction('edit');
            } else if (target.textContent === '삭제') {
                handlePostAction('delete');
            }
            menu.remove();
            document.removeEventListener('click', handleClick);
        };

        menu.addEventListener('click', handleClick);
        setTimeout(() => {
            document.addEventListener('click', () => {
                menu.remove();
                document.removeEventListener('click', handleClick);
            });
        }, 0);
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
                    onMorePress={showActionSheet}/>

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
            </main>

            <div
                className="fixed bottom-[var(--bottom-nav-height)] left-0 right-0 max-w-[var(--mobile-max-width)] mx-auto bg-white border-t">
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