import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHoldSelection } from "../../hooks/useHoldSelection";
import { useImageProcessing } from "../../hooks/useImageProcessing";
import { AnalysisResponse, Detection } from "../../types/hold";
import {UploadImage} from "../../types/community";

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
    } = useImageProcessing(imageUri);

    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setLayoutInfo({ width, height });
        }
    }, []);

    const getTopPoint = (points: [number, number][]): { x: number; y: number } => {
        if (!imageInfo) return { x: 0, y: 0 };

        // 모든 점들 중 가장 위쪽(y값이 가장 작은) 점을 찾음
        const topPoint = points.reduce((min, current) => {
            return current[1] < min[1] ? current : min;
        }, points[0]);

        // 스케일 적용
        const scaleX = imageInfo.displayWidth / imageInfo.originalWidth;
        const scaleY = imageInfo.displayHeight / imageInfo.originalHeight;

        return {
            x: topPoint[0] * scaleX + imageInfo.offsetX,
            y: topPoint[1] * scaleY + imageInfo.offsetY
        };
    };

    const generateImage = async () => {
        if (!imageContainerRef.current || !imageInfo) return null;

        try {
            setShowSaveButtons(false);
            await new Promise(resolve => setTimeout(resolve, 100));

            // 캔버스 생성
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            // 캔버스 크기 설정
            canvas.width = imageInfo.originalWidth;
            canvas.height = imageInfo.originalHeight;

            // 배경 이미지 로드
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageUri;
            });

            // 이미지 그리기
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // 이미지 크기에 따른 스케일 계산
            const scaleFactor = Math.min(canvas.width, canvas.height) / 1000;
            const lineWidth = Math.max(6, Math.floor(scaleFactor * 6));
            const labelWidth = Math.max(80, Math.floor(scaleFactor * 80));
            const labelHeight = Math.max(40, Math.floor(scaleFactor * 40));
            const fontSize = Math.max(30, Math.floor(scaleFactor * 30));
            const labelOffset = Math.max(50, Math.floor(scaleFactor * 50));

            // 선택된 홀드 그리기
            ctx.lineWidth = lineWidth;

            // 모든 선택된 홀드 먼저 그리기 (빨간색)
            analysisResult.objects.forEach((detection, index) => {
                if (selectedHolds.includes(index) && index !== startHold && index !== endHold) {
                    ctx.beginPath();
                    detection.points.forEach((point, i) => {
                        if (i === 0) ctx.moveTo(point[0], point[1]);
                        else ctx.lineTo(point[0], point[1]);
                    });
                    ctx.closePath();
                    ctx.strokeStyle = '#ef4444';
                    ctx.stroke();
                }
            });

            // 시작 홀드와 종료 홀드 그리기 (각각 녹색과 파란색)
            [
                { holdIndex: startHold, color: '#22c55e', label: '시작' },
                { holdIndex: endHold, color: '#3b82f6', label: '종료' }
            ].forEach(({ holdIndex, color, label }) => {
                if (holdIndex === null) return;

                const detection = analysisResult.objects[holdIndex];

                // 홀드 경계선 그리기
                ctx.beginPath();
                detection.points.forEach((point, i) => {
                    if (i === 0) ctx.moveTo(point[0], point[1]);
                    else ctx.lineTo(point[0], point[1]);
                });
                ctx.closePath();
                ctx.strokeStyle = color;
                ctx.stroke();

                // 레이블 박스 그리기
                const topPoint = detection.points.reduce((min, current) =>
                    current[1] < min[1] ? current : min, detection.points[0]);

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.roundRect(
                    topPoint[0] - labelWidth/2,
                    topPoint[1] - labelOffset,
                    labelWidth,
                    labelHeight,
                    10
                );
                ctx.fill();

                // 레이블 텍스트 그리기
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${fontSize}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(
                    label,
                    topPoint[0],
                    topPoint[1] - labelOffset + (labelHeight * 0.7)
                );
            });

            const image = canvas.toDataURL('image/jpeg', 1.0);
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

        const file = dataURLtoFile(image, 'climbing-problem.jpg');

        navigate('/community/problem', {
            state: {
                type: 'PROBLEM',
                problemImage: {
                    file: file,
                    preview: image,
                    isFixed: true
                } as UploadImage  // UploadImage 타입으로 명시
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

    // 다각형의 좌표들을 SVG path 문자열로 변환하는 함수
    const getPathFromPoints = (detection: Detection): string => {
        if (!imageInfo) return '';

        const scaledPoints = detection.points.map(([x, y]) => {
            const scaleX = imageInfo.displayWidth / imageInfo.originalWidth;
            const scaleY = imageInfo.displayHeight / imageInfo.originalHeight;
            return [
                x * scaleX + imageInfo.offsetX,
                y * scaleY + imageInfo.offsetY
            ];
        });

        return `M ${scaledPoints[0][0]} ${scaledPoints[0][1]} ` +
            scaledPoints.slice(1).map(point => `L ${point[0]} ${point[1]}`).join(' ') +
            ' Z';
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