import { useReducer } from 'react';
import { ReplyState, ReplyAction } from '../types/community';
import { usePostDetail } from './usePostDetail.ts';

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
    hasMore: true
};

function replyReducer(state: ReplyState, action: ReplyAction): ReplyState {
    switch (action.type) {
        case 'SET_REPLIES':
            return {
                ...state,
                replies: action.payload,
                totalCount: action.totalCount,
                hasMore: action.hasMore
            };
        case 'ADD_REPLY':
            return {
                ...state,
                replies: [...state.replies, action.payload]
            };
        case 'UPDATE_REPLY':
            return {
                ...state,
                replies: state.replies.map(reply =>
                    reply.id === action.payload.id
                        ? { ...reply, content: action.payload.content }
                        : reply
                )
            };
        case 'DELETE_REPLY':
            return {
                ...state,
                replies: state.replies.filter(reply => reply.id !== action.payload)
            };
        case 'SET_CHILDREN':
            return {
                ...state,
                childrenMap: {
                    ...state.childrenMap,
                    [action.payload.parentId]: action.payload.children
                }
            };
        case 'SET_LOADING':
            return {
                ...state,
                loadingStates: {
                    ...state.loadingStates,
                    [action.payload.replyId]: action.payload.isLoading
                }
            };
        case 'SELECT_REPLY':
            return {
                ...state,
                selectedReplyId: action.payload,
                replyText: '',
                editingReplyId: null
            };
        case 'SET_EDITING':
            return {
                ...state,
                editingReplyId: action.payload,
                selectedReplyId: null
            };
        case 'SET_REPLY_TEXT':
            return {
                ...state,
                replyText: action.payload
            };
        case 'SET_SUBMITTING':
            return {
                ...state,
                isSubmitting: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
}

export const useReplyState = (postId: string) => {
    const [state, dispatch] = useReducer(replyReducer, initialState);
    const postService = usePostDetail();

    const actions = {
        fetchReplies: async (page = 0) => {
            try {
                dispatch({ type: 'SET_SUBMITTING', payload: true });
                const response = await postService.fetchReplies(postId, page);
                dispatch({
                    type: 'SET_REPLIES',
                    payload: response.content,
                    totalCount: response.totalElements,
                    hasMore: !response.last,
                    page
                });
                return response;
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error as Error });
                throw error;
            } finally {
                dispatch({ type: 'SET_SUBMITTING', payload: false });
            }
        },

        createReply: async (content: string, parentId?: number | null) => {
            try {
                dispatch({ type: 'SET_SUBMITTING', payload: true });
                await postService.createReply(postId, content, parentId);
                await actions.fetchReplies();
                dispatch({ type: 'SET_REPLY_TEXT', payload: '' });
                dispatch({ type: 'SELECT_REPLY', payload: null });
            } finally {
                dispatch({ type: 'SET_SUBMITTING', payload: false });
            }
        },

        updateReply: async (replyId: number, content: string) => {
            try {
                dispatch({ type: 'SET_SUBMITTING', payload: true });
                await postService.updateReply(replyId, content);
                await actions.fetchReplies();
                dispatch({ type: 'SET_REPLY_TEXT', payload: '' });
                dispatch({ type: 'SET_EDITING', payload: null });
            } finally {
                dispatch({ type: 'SET_SUBMITTING', payload: false });
            }
        },

        deleteReply: async (replyId: number) => {
            await postService.deleteReply(replyId);
            await actions.fetchReplies();
        },

        fetchChildReplies: async (parentId: number, page: number) => {
            try {
                dispatch({ type: 'SET_LOADING', payload: { replyId: parentId, isLoading: true } });
                const response = await postService.fetchChildReplies(parentId, page);
                const children = response.content;

                dispatch({
                    type: 'SET_CHILDREN',
                    payload: { parentId, children }
                });

                return !response.last;
            } finally {
                dispatch({ type: 'SET_LOADING', payload: { replyId: parentId, isLoading: false } });
            }
        },

        selectReply: (replyId: number | null) => dispatch({ type: 'SELECT_REPLY', payload: replyId }),
        setEditing: (replyId: number | null) => dispatch({ type: 'SET_EDITING', payload: replyId }),
        setReplyText: (text: string) => dispatch({ type: 'SET_REPLY_TEXT', payload: text })
    };

    return { state, actions };
};