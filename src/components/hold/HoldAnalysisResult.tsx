import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHoldSelection } from "../../hooks/hold/useHoldSelection";
import { useImageProcessing } from "../../hooks/hold/useImageProcessing";
import { AnalysisResponse } from "../../types/hold";
import { UploadImage } from "../../types/community";
import {useCoordinateTransformation} from "../../hooks/hold/useCoordinateTransformation";
import {useImageGeneration} from "../../hooks/hold/useImageGeneration";

interface HoldAnalysisResultProps {
    imageUri: string;
    analysisResult: AnalysisResponse;
}

export default function HoldAnalysisResult({ imageUri, analysisResult }: HoldAnalysisResultProps) {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

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
        setLayoutInfo,
    } = useImageProcessing(imageUri);

    const { getTopPoint, getPathFromPoints } = useCoordinateTransformation(imageInfo);

    const { showSaveButtons, generateImage } = useImageGeneration(
        imageUri,
        imageInfo,
        analysisResult,
        selectedHolds,
        startHold,
        endHold
    );

    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setLayoutInfo({ width, height });
        }
    }, []);

    const handleDownload = async () => {
        const image = await generateImage();
        if (!image) {
            alert('이미지 저장에 실패했습니다.');
            return;
        }

        const link = document.createElement('a');
        link.download = 'climbing-problem.jpg';
        link.href = image;
        link.click();
    };

    const handleCreatePost = async () => {
        const image = await generateImage();
        if (!image) {
            alert('이미지 생성에 실패했습니다.');
            return;
        }

        const file = dataURLtoFile(image, 'climbing-problem.jpg');

        navigate('/community/problem', {
            state: {
                type: 'PROBLEM',
                problemImage: {
                    file: file,
                    preview: image,
                    isFixed: true
                } as UploadImage
            }
        });
    };

    const dataURLtoFile = (dataurl: string, filename: string): File => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-112px)] bg-white">
            <div className="py-4 px-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-center text-gray-800">
                    {getHeaderText()}
                </h2>
            </div>

            <div ref={containerRef} className="flex-1 relative">
                <div ref={imageContainerRef} className="relative">
                    {imageInfo && (
                        <>
                            <img
                                src={imageUri}
                                alt="Analyzed climbing hold"
                                className="relative"
                                style={{
                                    width: imageInfo.displayWidth,
                                    height: imageInfo.displayHeight,
                                    marginLeft: imageInfo.offsetX,
                                    marginTop: imageInfo.offsetY,
                                }}
                            />
                            <svg
                                className="absolute top-0 left-0"
                                style={{
                                    width: imageInfo.displayWidth + imageInfo.offsetX * 2,
                                    height: imageInfo.displayHeight + imageInfo.offsetY * 2,
                                }}
                            >
                                {analysisResult.objects.map((detection, index) => {
                                    const shouldShow = selectionStep === 'initial' ||
                                        (selectionStep !== 'complete' && selectedHolds.includes(index)) ||
                                        (selectionStep === 'complete' && (selectedHolds.includes(index) || index === startHold || index === endHold));

                                    if (!shouldShow) return null;

                                    const pathString = getPathFromPoints(detection);
                                    const isStart = index === startHold;
                                    const isEnd = index === endHold;
                                    const isSelected = selectedHolds.includes(index);

                                    return (
                                        <g key={index}>
                                            <path
                                                d={pathString}
                                                className={`cursor-pointer transition-colors fill-transparent ${
                                                    isSelected ? 'stroke-red-500' : 'stroke-transparent'
                                                } ${isStart ? '!stroke-green-500' : ''} 
                                                ${isEnd ? '!stroke-blue-500' : ''}`}
                                                strokeWidth="2"
                                                onClick={() => selectionStep !== 'complete' && handleHoldClick(index)}
                                            />
                                            {(isStart || isEnd) && (
                                                <foreignObject
                                                    x={getTopPoint(detection.points).x - 20}
                                                    y={getTopPoint(detection.points).y - 25}
                                                    width="40"
                                                    height="25"
                                                >
                                                    <div
                                                        className={`px-2 py-1 rounded text-xs font-bold text-white ${
                                                            isStart ? 'bg-green-500' : 'bg-blue-500'
                                                        }`}
                                                    >
                                                        {isStart ? '시작' : '종료'}
                                                    </div>
                                                </foreignObject>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                        </>
                    )}
                </div>

                {selectionStep === 'complete' && showSaveButtons && (
                    <div className="absolute bottom-0 left-0 right-0 flex gap-3 p-5 bg-white button-container">
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