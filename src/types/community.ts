export interface BasePost {
    id: number;
    title: string;
    createdAt: string;
}

export interface ListPost extends BasePost {
    isNew?: boolean;
    isHot?: boolean;
}

export interface PageableSort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: PageableSort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface PostListResponse {
    content: ListPost[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: PageableSort;
    numberOfElements: number;
    empty: boolean;
}

export interface PostListParams {
    page: number;
    size: number;
    category: PostCategory;
}

export type PostCategory = 'GENERAL' | 'PROBLEM' | 'TIMELINE';

export interface UsePostListReturn {
    posts: ListPost[];
    isLoading: boolean;
    isRefreshing: boolean;
    isLoadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    handleRefresh: () => void;
    handleLoadMore: () => void;
    handleRetry: () => void;
}

export interface Post extends BasePost {
    content: string;
    location?: string;
    level?: string;
    category: string;
    visibility: string;
    userId: number;
    userNickname: string;
    isWriter: boolean;
    files: File[];
    instagram_id?: string;
    isLiked: boolean;
    likeCount: number;
    replyCount: number;
}

export interface File {
    id: number;
    fileName: string;
    fileKey: string;
    url: string;
    fileType: string;
    fileSize: number;
    displayOrder: number;
    userId: number;
    status: string;
    createdAt: string;
}

export interface Reply {
    id: number;
    content: string;
    userId: number;
    userNickname: string;
    createdAt: string;
    isWriter: boolean;
    children?: Reply[];
    childCount: number;
    parent?: Reply;
    parentId?: number | null;
}

export interface ReplyState {
    replies: Reply[];
    childrenMap: { [key: number]: Reply[] };
    loadingStates: { [key: number]: boolean };
    pageStates: { [key: number]: number };
    pendingReplies: { [key: string]: PendingReply };
    selectedReplyId: number | null;
    editingReplyId: number | null;
    replyText: string;
    isSubmitting: boolean;
    error: Error | null;
    totalCount: number;
    hasMore: boolean;
}

export interface PendingReply {
    id: string;
    content: string;
    parentId: number | null;
    timestamp: number;
}

export type ReplyAction =
    | { type: 'SET_REPLIES'; payload: Reply[]; totalCount: number; hasMore: boolean; page: number }
    | { type: 'ADD_REPLY'; payload: Reply }
    | { type: 'UPDATE_REPLY'; payload: { id: number; content: string } }
    | { type: 'DELETE_REPLY'; payload: number }
    | { type: 'SET_CHILDREN'; payload: { parentId: number; children: Reply[] } }
    | { type: 'SET_LOADING'; payload: { replyId: number; isLoading: boolean } }
    | { type: 'SET_PAGE'; payload: { replyId: number; page: number } }
    | { type: 'SELECT_REPLY'; payload: number | null }
    | { type: 'SET_EDITING'; payload: number | null }
    | { type: 'SET_REPLY_TEXT'; payload: string }
    | { type: 'SET_SUBMITTING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: Error | null }
    | { type: 'UPDATE_CHILDREN'; payload: { parentId: number; children: Reply[]; page: number } };
