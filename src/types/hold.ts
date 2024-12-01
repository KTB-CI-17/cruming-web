export interface Coordinates {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface Detection {
    coordinates: Coordinates;
    confidence: number;
    class_id: number;
}

export interface AnalysisResponse {
    image_path: string;
    detections: Detection[];
}

export interface ImageInfo {
    originalWidth: number;
    originalHeight: number;
    displayWidth: number;
    displayHeight: number;
    offsetX: number;
    offsetY: number;
}

export type SelectionStep = 'initial' | 'start' | 'end' | 'complete';

export interface ScaledCoordinates {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface UseHoldSelectionReturn {
    selectedHolds: number[];
    startHold: number | null;
    endHold: number | null;
    selectionStep: SelectionStep;
    handleHoldClick: (index: number) => void;
    handleNext: () => void;
    isNextButtonEnabled: () => boolean;
    getHeaderText: () => string;
}

export interface UseImageProcessingReturn {
    imageInfo: ImageInfo | null;
    layoutInfo: { width: number; height: number } | null;
    setLayoutInfo: (info: { width: number; height: number } | null) => void;
    calculateScaledCoordinates: (coordinates: Coordinates) => ScaledCoordinates;
}