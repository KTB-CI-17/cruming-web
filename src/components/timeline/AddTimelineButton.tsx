import { Plus } from 'lucide-react';
import {LAYOUT, PADDING} from "../../constants/layout";

interface AddTimelineButtonProps {
    onClick: () => void;
}

export default function AddTimelineButton({ onClick }: AddTimelineButtonProps) {
    return (
        <button
            onClick={onClick}
            style={{
                bottom: `calc(${LAYOUT.TAB_BAR_HEIGHT} + ${PADDING.MAIN.BOTTOM})`,
                right: PADDING.MAIN.HORIZONTAL,
                marginRight: `calc((100vw - min(100vw, ${LAYOUT.MAX_CONTENT_WIDTH})) / 2)`,
                marginBottom: `calc((100vh - min(100vh, ${LAYOUT.MAX_CONTENT_HEIGHT})) / 2)`
            }}
            className="fixed w-14 h-14 bg-[#735BF2] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6344E3] transition-colors"
        >
            <Plus className="w-6 h-6 text-white" />
        </button>
    );
}