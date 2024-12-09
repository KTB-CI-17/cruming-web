import { Plus } from 'lucide-react';

interface AddTimelineButtonProps {
    onClick: () => void;
}

export default function AddTimelineButton({ onClick }: AddTimelineButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-10 right-5 w-14 h-14 bg-[#735BF2] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6344E3] transition-colors"
        >
            <Plus className="w-6 h-6 text-white" />
        </button>
    );
}