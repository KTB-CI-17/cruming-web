import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import {useHoldSelection} from "../../hooks/useHoldSelection.ts";
import {useImageProcessing} from "../../hooks/useImageProcessing.tsx";
import {AnalysisResponse} from "../../types/hold.ts";

interface HoldAnalysisResultProps {
    imageUri: string;
    analysisResult: AnalysisResponse;
}

export default function HoldAnalysisResult({ imageUri, analysisResult }: HoldAnalysisResultProps) {
    const navigate = useNavigate();
    const captureRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showSaveButtons, setShowSaveButtons] = useState(true);

    const {
        selectedHolds,
        startHold,
        endHold,
        selectionStep,
        handleHoldClick,
        handleNext,
        isNextButtonEnabled,
        getHeaderText
    } = useHoldSelection();

    const {
        imageInfo,
        layoutInfo,
        setLayoutInfo,
        calculateScaledCoordinates
    } = useImageProcessing(imageUri);

    // onLayout 대신 useEffect와 ref 사용
    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setLayoutInfo({ width, height });
        }
    }, []);

    const handleDownload = async () => {
        if (!captureRef.current) return;

        try {
            setShowSaveButtons(false);
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(captureRef.current);
            const image = canvas.toDataURL('image/jpg', 1.0);

            const link = document.createElement('a');
            link.download = 'climbing-problem.jpg';
            link.href = image;
            link.click();

            setShowSaveButtons(true);
        } catch (error) {
            console.error('Download failed:', error);
            alert('이미지 저장에 실패했습니다.');
            setShowSaveButtons(true);
        }
    };

    const handleCreatePost = () => {
        navigate('/community/new');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-112px)] bg-white">
            <div className="py-4 px-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-center text-gray-800">
                    {getHeaderText()}
                </h2>
            </div>

            <div
                ref={(el) => {
                    containerRef.current = el;
                    captureRef.current = el;
                }}
                className="flex-1 relative"
            >
                {imageInfo && (
                    <img
                        src={imageUri}
                        alt="Analyzed climbing hold"
                        className="absolute"
                        style={{
                            width: imageInfo.displayWidth,
                            height: imageInfo.displayHeight,
                            marginLeft: imageInfo.offsetX,
                            marginTop: imageInfo.offsetY,
                        }}
                    />
                )}

                {imageInfo && analysisResult?.detections?.map((detection, index) => {
                    const shouldShow = selectionStep === 'initial' ||
                        (selectionStep !== 'complete' && selectedHolds.includes(index)) ||
                        (selectionStep === 'complete' && (selectedHolds.includes(index) || index === startHold || index === endHold));

                    if (!shouldShow) return null;

                    const scaledCoords = calculateScaledCoordinates(detection.coordinates);

                    return (
                        <div key={index}>
                            <button
                                className={`absolute border-2 transition-colors cursor-pointer ${
                                    selectedHolds.includes(index) ? 'border-red-500' : 'border-transparent'
                                } ${index === startHold ? '!border-green-500' : ''}
                                ${index === endHold ? '!border-blue-500' : ''}`}
                                style={{
                                    left: scaledCoords.left,
                                    top: scaledCoords.top,
                                    width: scaledCoords.width,
                                    height: scaledCoords.height,
                                }}
                                onClick={() => selectionStep !== 'complete' && handleHoldClick(index)}
                            />
                            {(index === startHold || index === endHold) && (
                                <div
                                    className={`absolute px-2 py-1 rounded text-xs font-bold text-white ${
                                        index === startHold ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                    style={{
                                        left: scaledCoords.left,
                                        top: scaledCoords.top - 25,
                                    }}
                                >
                                    {index === startHold ? '시작' : '종료'}
                                </div>
                            )}
                        </div>
                    );
                })}

                {selectionStep === 'complete' && showSaveButtons && (
                    <div className="absolute bottom-0 left-0 right-0 flex gap-3 p-5 bg-white">
                        <button
                            onClick={handleDownload}
                            className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-900 font-semibold"
                        >
                            다운로드
                        </button>
                        <button
                            onClick={handleCreatePost}
                            className="flex-1 py-4 rounded-xl bg-[#735BF2] text-white font-semibold"
                        >
                            게시글 작성하기
                        </button>
                    </div>
                )}
            </div>

            {selectionStep !== 'complete' && (
                <div className="p-5">
                    <button
                        className={`w-full py-4 rounded-xl font-semibold text-white ${
                            isNextButtonEnabled() ? 'bg-[#735BF2]' : 'bg-gray-200'
                        }`}
                        onClick={handleNext}
                        disabled={!isNextButtonEnabled()}
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}