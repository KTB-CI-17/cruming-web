import { useState } from 'react';
import { FormData, ShapeType, FootType, LevelType } from '../../types/foot-analysis';
import { SHAPE_OPTIONS, TYPE_OPTIONS, LEVEL_OPTIONS } from '../../constants/foot-analysis';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface OptionProps<T extends string> {
    selected: boolean;
    label: string;
    onPress: () => void;
}

interface FootAnalysisFormProps {
    onSubmit: (data: FormData) => void;
}

const Option = <T extends string>({ selected, label, onPress }: OptionProps<T>) => (
    <button
        onClick={onPress}
        className={`
      flex items-center px-3 py-1.5 rounded-full border
      ${selected
            ? 'bg-primary border-primary text-white'
            : 'border-[#E4E9F2] bg-white text-[#8F9BB3]'}
    `}
    >
        <div className="flex items-center gap-2">
            <div className="relative w-5 h-5">
                {selected ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full border-[1.5px] border-white" />
                        <div className="absolute w-2 h-2 rounded-full bg-white" />
                    </div>
                ) : (
                    <div className="w-5 h-5 rounded-full border border-[#E4E9F2]" />
                )}
            </div>
            <span className="text-sm">{label}</span>
        </div>
    </button>
);

export function FootAnalysisForm({ onSubmit }: FootAnalysisFormProps) {
    const [formData, setFormData] = useState<FormData>({
        shape: 'Roman',
        type: 'normal',
        level: 'intermediate',
        footSize: '',
    })

    const validateFootSize = (size: string): boolean => {
        if (!/^\d+$/.test(size)) {
            alert('신발 사이즈는 숫자만 입력 가능합니다.');
            return false;
        }

        const sizeNum = parseInt(size, 10);
        if (sizeNum % 5 !== 0) {
            alert('신발 사이즈는 5단위로 입력해주세요.\n(예: 230, 235, 240...)');
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!formData.footSize) {
            alert('신발 사이즈를 입력해주세요.');
            return;
        }

        if (!validateFootSize(formData.footSize)) {
            return;
        }

        console.log('Form Data:', formData);
        onSubmit(formData);
    };

    const handleSizeChange = (value: string) => {
        if (value && !/^\d+$/.test(value)) {
            return;
        }
        setFormData({ ...formData, footSize: value });
    };

    return (
        <div className="flex flex-col h-full bg-white p-5 page-container">
            <img
                src={"/src/assets/foot-analysis/foot-types.png"}
                alt="발 유형 이미지"
                className="w-full h-[100px] object-contain mb-5"
            />

            <div className="space-y-6">
                <section>
                    <h2 className="text-lg font-bold text-[#1A1F36] mb-3">족형</h2>
                    <div className="flex flex-wrap gap-2">
                        {SHAPE_OPTIONS.map((option) => (
                            <Option<ShapeType>
                                key={option.id}
                                selected={formData.shape === option.id}
                                label={option.label}
                                onPress={() => setFormData({ ...formData, shape: option.id })}
                            />
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-[#1A1F36] mb-3">발볼</h2>
                    <div className="flex flex-wrap gap-2">
                        {TYPE_OPTIONS.map((option) => (
                            <Option<FootType>
                                key={option.id}
                                selected={formData.type === option.id}
                                label={option.label}
                                onPress={() => setFormData({ ...formData, type: option.id })}
                            />
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-[#1A1F36] mb-3">Level</h2>
                    <div className="flex flex-wrap gap-2">
                        {LEVEL_OPTIONS.map((option) => (
                            <Option<LevelType>
                                key={option.id}
                                selected={formData.level === option.id}
                                label={option.label}
                                onPress={() => setFormData({ ...formData, level: option.id })}
                            />
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-[#1A1F36] mb-3">Size</h2>
                    <div>
                        <input
                            type="text"
                            className="w-full px-3 py-3 border border-[#E4E9F2] rounded-xl text-sm"
                            placeholder="* 발 사이즈 (예: 230, 235, 240...)"
                            value={formData.footSize}
                            onChange={(e) => handleSizeChange(e.target.value)}
                            maxLength={3}
                        />
                        <p className="text-xs text-[#8F9BB3] mt-1 ml-1">
                            5단위로 입력해주세요
                        </p>
                    </div>
                </section>

                <button
                    onClick={handleSubmit}
                    className="mt-4 w-full bg-primary text-white py-4 rounded-xl text-base font-semibold"
                >
                    추천 암벽화 검색
                </button>
            </div>
        </div>
    );
}