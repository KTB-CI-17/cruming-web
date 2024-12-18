import { X } from 'lucide-react';

interface TimelineOptionsMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function TimelineOptionsMenu({
    isOpen,
    onClose,
    onEdit,
    onDelete
}: TimelineOptionsMenuProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
        >
            <div
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] p-5"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-semibold">옵션</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={() => {
                            onEdit();
                            onClose();
                        }}
                        className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50"
                    >
                        수정
                    </button>
                    <button
                        onClick={() => {
                            onDelete();
                            onClose();
                        }}
                        className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 text-red-500"
                    >
                        삭제
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 text-left rounded-lg bg-gray-50 mt-2"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}