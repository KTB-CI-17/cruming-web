import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { colorLevelOptions } from '../../types/timeline';
import { Dot } from './Dot';

interface ColorLevelSelectProps {
    value: string;
    onChange: (level: string) => void;
}

export default function ColorLevelSelect({ value, onChange }: ColorLevelSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (colorValue: string) => {
        onChange(colorValue);
        setIsOpen(false);
    };

    const getSelectedLabel = () => {
        const option = colorLevelOptions.find(opt => opt.value === value);
        return option ? option.label : '* Level';
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full p-3 border border-gray-200 rounded-lg flex justify-between items-center"
            >
                <div className="flex items-center">
                    {value && <Dot color={value} />}
                    <span className={value ? 'text-black' : 'text-gray-400'}>
                        {getSelectedLabel()}
                    </span>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
                    <div className="bg-white w-full rounded-t-[20px] max-h-[90vh]">
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative flex justify-center items-center">
                                <h3 className="text-lg font-semibold">Level 선택</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute right-0 p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="p-5 grid grid-cols-2 gap-3">
                            {colorLevelOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
                                >
                                    <Dot color={option.color} />
                                    <span className="text-gray-700">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}