import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LAYOUT, PADDING } from '../../../../constants/layout.ts';

const AddButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/community/general')}
            style={{
                bottom: `calc(${LAYOUT.TAB_BAR_HEIGHT} + ${PADDING.MAIN.BOTTOM})`,
                right: PADDING.MAIN.HORIZONTAL,
                marginRight: `calc((100vw - min(100vw, ${LAYOUT.MAX_CONTENT_WIDTH})) / 2)`,
                marginBottom: `calc((100vh - min(100vh, ${LAYOUT.MAX_CONTENT_HEIGHT})) / 2)`
            }}
            className="fixed w-14 h-14 rounded-full bg-[#735BF2]
                     flex items-center justify-center shadow-lg"
        >
            <Plus className="w-6 h-6 text-white" />
        </button>
    );
};

export default AddButton;