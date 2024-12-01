import { XMarkIcon } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Reply } from "../../../types/community.ts";
import {useRef} from "react";

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
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = (element: HTMLTextAreaElement) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    };

    const resetTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '42px';
        }
    };

    const handleSubmit = async () => {
        await onSubmitReply();
        resetTextarea();
    };

    return (
        <div className="border-t bg-white shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
            {(selectedReply || isEditing) && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-b border-blue-100">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-400 rounded-full"/>
                        <span className="text-sm text-blue-700 font-medium">
                    {isEditing ? '댓글 수정' : `${selectedReply?.userNickname}님에게 답글 작성`}
                </span>
                    </div>
                    <button
                        onClick={onCancelReply}
                        className="p-1.5 hover:bg-blue-100 rounded-full transition-colors"
                    >
                        <XMarkIcon className="w-4 h-4 text-blue-600"/>
                    </button>
                </div>
            )}
            <div className="p-3">
                <div className="relative flex items-center bg-[#F8F9FA] rounded-lg overflow-hidden">
                    <textarea
                        ref={textareaRef}
                        className="w-full pr-11 pl-4 py-2.5 text-[15px] bg-transparent rounded-lg resize-none outline-none focus:ring-0 border-0 leading-6"
                        placeholder={
                            isEditing
                                ? "댓글을 수정하세요"
                                : selectedReply
                                    ? "답글을 입력하세요"
                                    : "댓글을 입력하세요"
                        }
                        value={replyText}
                        onChange={(e) => {
                            onReplyTextChange(e.target.value);
                            adjustHeight(e.target);
                        }}
                        maxLength={1000}
                        rows={1}
                        style={{
                            height: '42px',
                            maxHeight: '120px',
                            overflow: replyText ? 'auto' : 'hidden'
                        }}
                    />
                    <button
                        className={`absolute right-2 flex items-center justify-center p-1.5 rounded-lg transition-colors ${
                            !replyText.trim() || isSubmitting
                                ? 'text-gray-300'
                                : 'text-blue-500'
                        }`}
                        onClick={handleSubmit}
                        disabled={!replyText.trim() || isSubmitting}
                    >
                        <PaperAirplaneIcon className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}