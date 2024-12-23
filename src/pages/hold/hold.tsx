import { useRef } from 'react';
import { Camera } from 'lucide-react';
import HoldAnalysisLoading from "../../components/hold/HoldAnalysisLoading";
import HoldAnalysisResult from "../../components/hold/HoldAnalysisResult";
import {useHoldAnalysis} from "../../hooks/hold/useHoldAnalysis";

export default function HoldPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        imageUrl,
        isLoading,
        analysisComplete,
        analysisResult,
        handleImageSelect,
        handleSubmit
    } = useHoldAnalysis();

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageSelect(file);
        }
    };

    if (isLoading) {
        return <HoldAnalysisLoading />;
    }

    if (analysisComplete && analysisResult && imageUrl) {
        return (
            <HoldAnalysisResult
                imageUri={imageUrl}
                analysisResult={analysisResult}
            />
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-112px)] bg-white p-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/*"
                className="hidden"
            />

            <div
                className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl mb-5 overflow-hidden cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Selected climbing hold"
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <>
                        <Camera className="w-10 h-10 text-gray-400" />
                        <p className="mt-3 text-gray-400">사진 선택</p>
                    </>
                )}
            </div>

            <p className="text-sm text-gray-700 mb-5">
                Tip. 홀드가 잘 보이게 찍어주세요.
            </p>

            <button
                className={`mt-4 w-full py-4 rounded-xl text-base font-semibold text-white ${
                    !imageUrl ? 'bg-gray-200' : 'bg-[#735BF2]'
                }`}
                disabled={!imageUrl}
                onClick={handleSubmit}
            >
                홀드 좌표 추출
            </button>
        </div>
    );
}