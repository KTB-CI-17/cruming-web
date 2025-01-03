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

export type PostCategory = 'GENERAL' | 'PROBLEM' | 'TIMELINE';

export interface PostFile {
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

export interface Post extends BasePost {
    content: string;
    location?: string;
    level?: string;
    category: string;
    visibility: string;
    userId: number;
    userNickname: string;
    userProfile: string;
    isWriter: boolean;
    files: PostFile[];
    instagram_id?: string;
    isLiked: boolean;
    likeCount: number;
    replyCount: number;
    views: number;
}

export interface Reply {
    id: number;
    content: string;
    userId: number;
    userProfile: string;
    userNickname: string;
    createdAt: string;
    isWriter: boolean;
    childCount: number;
    parent?: Reply;
    parentId?: number | null;
}

export interface ReplyState {
    replies: Reply[];
    loadingStates: { [key: number]: boolean };
    selectedReplyId: number | null;
    editingReplyId: number | null;
    replyText: string;
    isSubmitting: boolean;
    error: Error | null;
    totalCount: number;
    hasMore: boolean;
    childrenMap: { [key: number]: Reply[] };
    childrenHasMore: { [key: number]: boolean };
    currentPage: number;
}

export type ReplyAction =
    | { type: 'SET_REPLIES'; payload: Reply[]; totalCount: number; hasMore: boolean; page: number }
    | { type: 'SET_CHILDREN'; payload: { parentId: number; children: Reply[]; hasMore: boolean } }
    | { type: 'UPDATE_REPLY'; payload: { id: number; content: string } }
    | { type: 'DELETE_REPLY'; payload: number }
    | { type: 'SET_LOADING'; payload: { replyId: number; isLoading: boolean } }
    | { type: 'SELECT_REPLY'; payload: number | null }
    | { type: 'SET_EDITING'; payload: number | null }
    | { type: 'SET_REPLY_TEXT'; payload: string }
    | { type: 'SET_SUBMITTING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: Error };

export interface CreatePostRequest {
    category: PostCategory;
    title: string;
    content: string;
    locationRequest: {
        placeName: string;
        address: string;
        latitude: number;
        longitude: number;
    } | null;
    level: string | null;
    fileRequests: {
        originalFileName: string;
        displayOrder: number;
    }[];
}

export interface UploadImage {
    id?: number;
    file: globalThis.File;
    preview: string;
    isFixed?: boolean;
}

export interface PostFormContentProps {
    title: string,
    content: string,
    images: UploadImage[],
    onTitleChange: (value: string) => void,
    onContentChange: (value: string) => void,
    onImagesChange: (images: UploadImage[]) => void,
    isLoading: boolean,
    className?: string
}

export interface ImageUploadAreaProps {
    images: UploadImage[];
    onImagesChange: (images: UploadImage[]) => void;
    disabled?: boolean;
}