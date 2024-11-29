import { useState } from 'react';
import { FormData } from '../../types/foot-analysis';
import { DUMMY_RESULTS } from '../../constants/foot-analysis';
import { ShoeCard } from './ShoeCard';
import {FootAnalysisForm} from "./FootAnlysisForm.tsx";

export function FootAnalysisResult() {
    const [showResults, setShowResults] = useState(false);
    const [formData, setFormData] = useState<FormData | null>(null);

    const handleSubmit = (data: FormData) => {
        console.log('Submitted form data:', data);
        setFormData(data);
        setShowResults(true);
    };

    const handleReset = () => {
        setShowResults(false);
        setFormData(null);
    };

    if (showResults && formData) {
        return (
            <div className="flex flex-col h-full bg-white page-container">
                <div className="flex-1 overflow-auto">
                    <div className="p-5 pb-0">
                        {DUMMY_RESULTS.map((shoe) => (
                            <ShoeCard
                                key={shoe.id}
                                modelName={shoe.modelName}
                                size={shoe.size}
                                productUrl={shoe.productUrl}
                                imageUrl={shoe.imageUrl}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-5 bg-white">
                    <button
                        onClick={handleReset}
                        className="w-full bg-primary text-white py-4 px-4 rounded-xl font-semibold text-base"
                    >
                        다시 검색하기
                    </button>
                </div>
            </div>
        );
    }

    return <FootAnalysisForm onSubmit={handleSubmit} />;
}