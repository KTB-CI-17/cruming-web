import { Reply } from '../../../types/community';

interface PostReplyInputProps {
    replyText: string;
    onReplyTextChange: (text: string) => void;
    selectedReply: Reply | null;
    onCancelReply: () => void;
    onSubmitReply: () => void;
    isSubmitting: boolean;
    isEditing: boolean;
}

export default function PostReplyInput({
                                           replyText,
                                           onReplyTextChange,
                                           selectedReply,
                                           onCancelReply,
                                           onSubmitReply,
                                           isSubmitting,
                                           isEditing,
                                       }: PostReplyInputProps) {
    return (
        <div className="border-t border-gray-200 p-4">
            {(selectedReply || isEditing) && (
                <div className="flex justify-between items-center mb-2 bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600">
                        {isEditing ? '댓글 수정 중' : `${selectedReply?.userNickname}님에게 답글 작성 중`}
                    </span>
                    <button onClick={onCancelReply} className="text-sm text-gray-500">
                        취소
                    </button>
                </div>
            )}
            <div className="flex gap-2">
                <textarea
                    value={replyText}
                    onChange={(e) => onReplyTextChange(e.target.value)}
                    placeholder={isEditing ? "댓글을 수정하세요" : selectedReply ? "답글을 입력하세요" : "댓글을 입력하세요"}
                    className="flex-1 p-2 border rounded resize-none h-[100px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    maxLength={1000}
                />
                <button
                    onClick={onSubmitReply}
                    disabled={!replyText.trim() || isSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded h-fit disabled:opacity-50"
                >
                    {isSubmitting ? '처리중...' : isEditing ? '수정' : '작성'}
                </button>
            </div>
        </div>
    );
}