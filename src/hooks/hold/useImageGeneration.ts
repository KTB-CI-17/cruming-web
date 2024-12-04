import { useState } from 'react';
import {AnalysisResponse, ImageInfo} from "../../types/hold";

interface DrawSettings {
    lineWidth: number;
    labelWidth: number;
    labelHeight: number;
    fontSize: number;
    labelOffset: number;
}

export const useImageGeneration = (
    imageUri: string,
    imageInfo: ImageInfo | null,
    analysisResult: AnalysisResponse,
    selectedHolds: number[],
    startHold: number | null,
    endHold: number | null
) => {
    const [showSaveButtons, setShowSaveButtons] = useState(true);

    const calculateDrawSettings = (canvas: HTMLCanvasElement): DrawSettings => {
        const scaleFactor = Math.min(canvas.width, canvas.height) / 1000;
        return {
            lineWidth: Math.max(6, Math.floor(scaleFactor * 6)),
            labelWidth: Math.max(80, Math.floor(scaleFactor * 80)),
            labelHeight: Math.max(40, Math.floor(scaleFactor * 40)),
            fontSize: Math.max(30, Math.floor(scaleFactor * 30)),
            labelOffset: Math.max(50, Math.floor(scaleFactor * 50))
        };
    };

    const generateImage = async () => {
        if (!imageInfo) return null;

        try {
            setShowSaveButtons(false);
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            canvas.width = imageInfo.originalWidth;
            canvas.height = imageInfo.originalHeight;

            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageUri;
            });

            // 이미지 그리기
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const settings = calculateDrawSettings(canvas);

            // 선택된 홀드 그리기
            ctx.lineWidth = settings.lineWidth;

            // 일반 선택된 홀드 그리기 (빨간색)
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

            // 시작/종료 홀드 그리기
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
                    topPoint[0] - settings.labelWidth/2,
                    topPoint[1] - settings.labelOffset,
                    settings.labelWidth,
                    settings.labelHeight,
                    10
                );
                ctx.fill();

                // 레이블 텍스트 그리기
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${settings.fontSize}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(
                    label,
                    topPoint[0],
                    topPoint[1] - settings.labelOffset + (settings.labelHeight * 0.7)
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

    return {
        showSaveButtons,
        generateImage
    };
};