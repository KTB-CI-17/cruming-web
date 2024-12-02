interface MoreActionsMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const MoreActionsMenu = ({ isOpen, onClose, onEdit, onDelete }: MoreActionsMenuProps) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 z-50"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className="fixed inset-0 flex items-center justify-center z-50"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-lg overflow-hidden w-72"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col">
                        <button
                            onClick={() => {
                                onEdit();
                                onClose();
                            }}
                            className="py-4 text-center text-base hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                            수정하기
                        </button>
                        <div className="h-[1px] bg-gray-200" />
                        <button
                            onClick={() => {
                                onDelete();
                                onClose();
                            }}
                            className="py-4 text-center text-base text-red-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                            삭제하기
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MoreActionsMenu;