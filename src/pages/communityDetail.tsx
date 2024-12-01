import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import {usePost} from "../hooks/usePostDetail.ts";
import {useReply} from "../hooks/useReply.ts";
import {api} from "../config/axios.ts";
import {Reply} from "../types/community.ts";
import PostContent from "../components/community/detail/PostContent.tsx";
import PostImageSlider from "../components/community/detail/PostImageSlider.tsx";
import PostHeader from "../components/community/detail/PostHeader.tsx";
import PostReply from "../components/community/detail/PostReply.tsx";
import PostActions from "../components/community/detail/PostActions.tsx";
import PostReplyInput from "../components/community/detail/PostReplyInput.tsx";

export default function CommunityDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [imagesCache, setImagesCache] = useState<{[key: string]: string}>({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const {
        post,
        isLoading,
        error,
        fetchPost,
        deletePost,
        togglePostLike
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
        fetchPost();
    }, [id]);

    useEffect(() => {
        const loadImages = async () => {
            if (!post) return;
            try {
                const imagePromises = post.files.map(async file => {
                    const response = await api.get(`/files${file.url}`, { responseType: 'blob' });
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

    const getSelectedReplyInfo = () => {
        if (!replyState.selectedReplyId) return null;
        return replyState.replies.reduce<Reply | null>((found, reply) => {
            if (found) return found;
            if (reply.id === replyState.selectedReplyId) return reply;
            if (reply.children) {
                const childReply = reply.children.find(child => child.id === replyState.selectedReplyId);
                if (childReply) return childReply;
            }
            return found;
        }, null);
    };

    const handleProfilePress = (userId: number) => {
        navigate(`/profile/${userId}`);
    };

    const handlePostAction = async (action: 'delete' | 'edit') => {
        if (action === 'delete') {
            if (window.confirm('게시글을 삭제하시겠습니까?')) {
                try {
                    await deletePost();
                    navigate(-1);
                } catch (error) {
                    alert('삭제에 실패했습니다.');
                }
            }
        } else {
            navigate(`/community/edit/${id}`);
        }
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
                <PostHeader
                    post={post}
                    onProfilePress={handleProfilePress}
                    onMorePress={showActionSheet}
                />

                <PostContent post={post}/>

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
                        onLoadMore={() => replyActions.fetchReplies(Math.ceil(replyState.replies.length / 10))}
                        hasMore={replyState.hasMore}
                        loading={replyState.isSubmitting}
                        onReply={replyActions.selectReply}
                        onProfilePress={handleProfilePress}
                        onLoadChildren={replyActions.fetchChildReplies}
                        onDeleteReply={replyActions.deleteReply}
                        onEditReply={replyActions.setEditing}
                        totalCount={replyState.totalCount}
                        loadingStates={replyState.loadingStates}
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
                    onSubmitReply={() => replyActions.createReply(
                        replyState.replyText.trim(),
                        replyState.selectedReplyId
                    )}
                    isSubmitting={replyState.isSubmitting}
                    isEditing={!!replyState.editingReplyId}
                />
            </div>
        </div>
    );
}