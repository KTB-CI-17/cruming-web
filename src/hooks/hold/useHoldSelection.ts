import { useState } from 'react';
import { SelectionStep, UseHoldSelectionReturn } from '../../types/hold';

export const useHoldSelection = (): UseHoldSelectionReturn => {
    const [selectedHolds, setSelectedHolds] = useState<number[]>([]);
    const [startHold, setStartHold] = useState<number | null>(null);
    const [endHold, setEndHold] = useState<number | null>(null);
    const [selectionStep, setSelectionStep] = useState<SelectionStep>('initial');

    const handleHoldClick = (index: number) => {
        switch (selectionStep) {
            case 'initial':
                setSelectedHolds(prev =>
                    prev.includes(index)
                        ? prev.filter(i => i !== index)
                        : [...prev, index]
                );
                break;
            case 'start':
                if (selectedHolds.includes(index)) {
                    setStartHold(startHold === index ? null : index);
                }
                break;
            case 'end':
                if (selectedHolds.includes(index)) {
                    setEndHold(endHold === index ? null : index);
                }
                break;
        }
    };

    const getHeaderText = () => {
        switch (selectionStep) {
            case 'initial':
                return '문제로 만들 홀드를 선택해주세요';
            case 'start':
                return '시작 홀드를 선택해주세요';
            case 'end':
                return '종료 홀드를 선택해주세요';
            case 'complete':
                return '문제 생성이 완료되었습니다';
            default:
                return '';
        }
    };

    const isNextButtonEnabled = () => {
        switch (selectionStep) {
            case 'initial':
                return selectedHolds.length > 0;
            case 'start':
                return startHold !== null;
            case 'end':
                return endHold !== null;
            default:
                return false;
        }
    };

    const handleNext = () => {
        switch (selectionStep) {
            case 'initial':
                setSelectionStep('start');
                break;
            case 'start':
                setSelectionStep('end');
                break;
            case 'end':
                setSelectionStep('complete');
                break;
        }
    };

    return {
        selectedHolds,
        startHold,
        endHold,
        selectionStep,
        handleHoldClick,
        handleNext,
        isNextButtonEnabled,
        getHeaderText,
    };
};