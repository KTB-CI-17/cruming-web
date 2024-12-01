import { useReducer, useCallback } from 'react';
import {api} from "../config/axios.ts";
import {ReplyAction, ReplyState} from "../types/community.ts";

const initialState: ReplyState = {
    replies: [],
    childrenMap: {},
    loadingStates: {},
    pageStates: {},
    pendingReplies: {},
    selectedReplyId: null,
    editingReplyId: null,
    replyText: '',
    isSubmitting: false,
    error: null,
    totalCount: 0,
    hasMore: true,
};

function replyReducer(state: ReplyState, action: ReplyAction): ReplyState {
    switch (action.type) {
        case 'SET_REPLIES':
            return {
                ...state,
                replies: action.page === 0 ? action.payload : [...state.replies, ...action.payload],
                totalCount: action.totalCount,
                hasMore: action.hasMore,
            };
        case 'UPDATE_REPLY':
            return {
                ...state,
                replies: state.replies.map(reply => {
                    if (reply.id === action.payload.id) {
                        return { ...reply, content: action.payload.content };
                    }
                    if (reply.children) {
                        return {
                            ...reply,
                            children: reply.children.map(child =>
                                child.id === action.payload.id
                                    ? { ...child, content: action.payload.content }
                                    : child
                            ),
                        };
                    }
                    return reply;
                }),
            };
        case 'UPDATE_CHILDREN':
            return {
                ...state,
                replies: state.replies.map(reply => {
                    if (reply.id === action.payload.parentId) {
                        const existingChildren = reply.children || [];
                        const newChildren = action.payload.page === 0
                            ? action.payload.children
                            : [...existingChildren, ...action.payload.children];

                        return {
                            ...reply,
                            children: newChildren,
                        };
                    }
                    return reply;
                }),
            };
        case 'DELETE_REPLY':
            return {
                ...state,
                replies: state.replies.filter(reply => {
                    if (reply.id === action.payload) return false;
                    if (reply.children) {
                        reply.children = reply.children.filter(
                            child => child.id !== action.payload
                        );
                    }
                    return true;
                }),
            };
        case 'SET_LOADING':
            return {
                ...state,
                loadingStates: {
                    ...state.loadingStates,
                    [action.payload.replyId]: action.payload.isLoading,
                },
            };
        case 'SELECT_REPLY':
            return {
                ...state,
                selectedReplyId: action.payload,
                editingReplyId: null,
            };
        case 'SET_EDITING':
            return {
                ...state,
                editingReplyId: action.payload,
                selectedReplyId: null,
            };
        case 'SET_REPLY_TEXT':
            return {
                ...state,
                replyText: action.payload,
            };
        case 'SET_SUBMITTING':
            return {
                ...state,
                isSubmitting: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}

export function useReply(postId: string) {
    const [state, dispatch] = useReducer(replyReducer, initialState);

    const fetchReplies = useCallback(async (page = 0) => {
        try {
            const { data } = await api.get(`/posts/${postId}/replies`, {
                params: { page, size: 10, sort: 'createdAt,asc' }
            });

            dispatch({
                type: 'SET_REPLIES',
                payload: data.content,
                totalCount: data.totalElements,
                hasMore: !data.last,
                page
            });
            return data;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            throw error;
        }
    }, [postId]);

    const fetchChildReplies = useCallback(async (parentId: number, page = 0) => {
        dispatch({ type: 'SET_LOADING', payload: { replyId: parentId, isLoading: true } });

        try {
            const { data } = await api.get(`/posts/replies/${parentId}/children`, {
                params: { page, size: 5, sort: 'createdAt,asc' }
            });

            dispatch({
                type: 'UPDATE_CHILDREN',
                payload: {
                    parentId,
                    children: data.content,
                    page
                }
            });
            return true;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: { replyId: parentId, isLoading: false } });
        }
    }, []);

    const createReply = useCallback(async (content: string, parentId?: number | null) => {
        dispatch({ type: 'SET_SUBMITTING', payload: true });

        try {
            const url = parentId
                ? `/posts/${postId}/replies/${parentId}`
                : `/posts/${postId}/replies`;

            await api.post(url, { content });
            await fetchReplies(0);
            dispatch({ type: 'SET_REPLY_TEXT', payload: '' });
            dispatch({ type: 'SELECT_REPLY', payload: null });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            throw error;
        } finally {
            dispatch({ type: 'SET_SUBMITTING', payload: false });
        }
    }, [postId, fetchReplies]);

    const updateReply = useCallback(async (replyId: number, content: string) => {
        dispatch({ type: 'SET_SUBMITTING', payload: true });

        try {
            await api.put(`/posts/replies/${replyId}`, { content });
            dispatch({ type: 'UPDATE_REPLY', payload: { id: replyId, content } });
            dispatch({ type: 'SET_REPLY_TEXT', payload: '' });
            dispatch({ type: 'SET_EDITING', payload: null });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            throw error;
        } finally {
            dispatch({ type: 'SET_SUBMITTING', payload: false });
        }
    }, []);

    const deleteReply = useCallback(async (replyId: number) => {
        try {
            await api.delete(`/posts/replies/${replyId}`);
            dispatch({ type: 'DELETE_REPLY', payload: replyId });
        } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error as Error });
        throw error;
        }
    }, []);

    const findReplyById = (replyId: number) => {
        const parentReply = state.replies.find(reply => reply.id === replyId);
        if (parentReply) return parentReply;

        for (const reply of state.replies) {
            if (reply.children) {
                const childReply = reply.children.find(child => child.id === replyId);
                if (childReply) return childReply;
            }
        }
        return null;
    };

    return {
        state,
        actions: {
            fetchReplies,
            fetchChildReplies,
            createReply,
            updateReply,
            deleteReply,
            selectReply: (id: number | null) => dispatch({ type: 'SELECT_REPLY', payload: id }),
            setEditing: (id: number | null) => {
                if (id) {
                    const reply = findReplyById(id);
                    if (reply) {
                        dispatch({ type: 'SET_REPLY_TEXT', payload: reply.content });
                    }
                } else {
                    dispatch({ type: 'SET_REPLY_TEXT', payload: '' });
                }
                dispatch({ type: 'SET_EDITING', payload: id });
            },
            setReplyText: (text: string) => dispatch({ type: 'SET_REPLY_TEXT', payload: text }),
        },
    };
}