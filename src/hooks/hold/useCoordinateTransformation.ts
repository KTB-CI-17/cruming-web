import {Detection, ImageInfo} from "../../types/hold";

export const useCoordinateTransformation = (imageInfo: ImageInfo | null) => {
    const getTopPoint = (points: [number, number][]): { x: number; y: number } => {
        if (!imageInfo) return { x: 0, y: 0 };

        const topPoint = points.reduce((min, current) => {
            return current[1] < min[1] ? current : min;
        }, points[0]);

        const scaleX = imageInfo.displayWidth / imageInfo.originalWidth;
        const scaleY = imageInfo.displayHeight / imageInfo.originalHeight;

        return {
            x: topPoint[0] * scaleX + imageInfo.offsetX,
            y: topPoint[1] * scaleY + imageInfo.offsetY
        };
    };

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

    return {
        getTopPoint,
        getPathFromPoints
    };
};