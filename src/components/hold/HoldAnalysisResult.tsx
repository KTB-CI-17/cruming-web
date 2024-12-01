import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useHoldSelection } from "../../hooks/useHoldSelection.ts";
import { useImageProcessing } from "../../hooks/useImageProcessing.tsx";
import { AnalysisResponse } from "../../types/hold.ts";

interface HoldAnalysisResultProps {
    imageUri: string;
    analysisResult: AnalysisResponse;
}

export default function HoldAnalysisResult({ imageUri, analysisResult }: HoldAnalysisResultProps) {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
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
        setLayoutInfo,
        calculateScaledCoordinates
    } = useImageProcessing(imageUri);

    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setLayoutInfo({ width, height });
        }
    }, []);

    const generateImage = async () => {
        if (!imageContainerRef.current || !imageInfo) return null;

        try {
            setShowSaveButtons(false);
            await new Promise(resolve => setTimeout(resolve, 100));

            // 이미지 요소만을 포함하는 임시 div 생성
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '0';
            tempDiv.style.top = '0';
            tempDiv.style.width = `${imageInfo.displayWidth}px`;
            tempDiv.style.height = `${imageInfo.displayHeight}px`;

            // 원본 컨테이너의 내용을 복제
            const clone = imageContainerRef.current.cloneNode(true) as HTMLElement;

            // 클론된 요소의 스타일 조정
            const clonedImg = clone.querySelector('img');
            if (clonedImg) {
                clonedImg.style.margin = '0';
                clonedImg.style.width = `${imageInfo.displayWidth}px`;
                clonedImg.style.height = `${imageInfo.displayHeight}px`;
            }

            tempDiv.appendChild(clone);
            document.body.appendChild(tempDiv);

            const canvas = await html2canvas(tempDiv, {
                backgroundColor: null,
                useCORS: true,
                logging: false,
                imageTimeout: 0,
                width: imageInfo.displayWidth,
                height: imageInfo.displayHeight,
                ignoreElements: (element) => {
                    return element.classList.contains('button-container');
                }
            });

            document.body.removeChild(tempDiv);

            const image = canvas.toDataURL('image/jpg', 1.0);
            setShowSaveButtons(true);
            return image;
        } catch (error) {
            console.error('Image generation failed:', error);
            setShowSaveButtons(true);
            return null;
        }
    };

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

        navigate('/community/problem', {
            state: {
                problemImage: {
                    file: dataURLtoFile(image, 'climbing-problem.jpg'),
                    preview: image
                }
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