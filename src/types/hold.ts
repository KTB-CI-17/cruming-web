export interface Point {
    x: number;
    y: number;
}

export interface Detection {
    object_id: number;
    area: number;
    center_point: Point;
    num_points: number;
    points: [number, number][];
}

export interface AnalysisResponse {
    info: {
        date_created: string;
        image_path: string;
        total_objects: number;
    };
    objects: Detection[];
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
}