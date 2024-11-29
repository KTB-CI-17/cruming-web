import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LAYOUT } from '../../../constants/layout.ts';

const AddButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/community/new')}
            style={{
                bottom: `calc(${LAYOUT.TAB_BAR_HEIGHT} + 1.5rem)` // TabBar 높이 + 여백
            }}
            className="fixed right-5 w-14 h-14 rounded-full bg-[#735BF2]
                     flex items-center justify-center shadow-lg"
        >
            <Plus className="w-6 h-6 text-white" />
        </button>
    );
};

export default AddButton;