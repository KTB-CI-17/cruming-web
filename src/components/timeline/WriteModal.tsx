import { useState } from 'react';
import { X } from 'lucide-react';
import { TimelineFormData, PrivacyType } from '../../types/timeline';
import DatePicker from './DatePicker';
import ColorLevelSelect from './ColorLevelSelect';
import ImageUpload from './ImageUpload';
import LocationSearch from "../common/LocationSearch";
import {api} from "../../config/axios";

interface TimelineWriteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateSuccess: () => void;
}

const initialFormData: TimelineFormData = {
    location: '',
    activityDate: '',
    level: '',
    content: '',
    images: [],
    privacy: '전체 공개'
};

export default function TimelineWriteModal({ isOpen, onClose }: TimelineWriteModalProps) {
    const [formData, setFormData] = useState<TimelineFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const requiredFields: { field: keyof TimelineFormData; label: string }[] = [
            { field: 'location', label: '위치' },
            { field: 'activityDate', label: '활동 일자' },
            { field: 'level', label: 'Level' },
            { field: 'content', label: '내용' }
        ];

        const emptyFields = requiredFields
            .filter(({ field }) => !formData[field] || formData[field].toString().trim() === '')
            .map(({ label }) => label);

        if (emptyFields.length > 0) {
            alert(`다음 항목을 입력해주세요:\n${emptyFields.join('\n')}`);
            return false;
        }

        return true;
    };

    const hasInputValues = () => {
        return (
            formData.location.trim() !== '' ||
            formData.activityDate !== '' ||
            formData.level !== '' ||
            formData.content.trim() !== '' ||
            formData.images.length > 0 ||
            formData.privacy !== '전체 공개'
        );
    };

    const handleClose = () => {
        if (!hasInputValues() || isSubmitting) {
            resetAndClose();
            return;
        }

        if (confirm("입력하신 내용은 저장되지 않습니다. 입력을 취소하시겠습니까?")) {
            resetAndClose();
        }
    };

    const resetAndClose = () => {
        setFormData(initialFormData);
        setIsSubmitting(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        if (confirm("입력하신 내용으로 등록하시겠습니까?")) {
            setIsSubmitting(true);
            try {
                // API 연동 추가
                const response = await api.post('/timelines', formData);
                console.log('Timeline created:', response.data);
                resetAndClose();
            } catch (error) {
                console.error('Failed to create timeline:', error);
                alert('등록에 실패했습니다. 다시 시도해주세요.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleInputChange = (field: keyof TimelineFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-[20px] max-h-[90vh] overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                    <div className="relative flex justify-center items-center">
                        <h2 className="text-lg font-semibold">타임라인 등록</h2>
                        <button
                            onClick={handleClose}
                            className="absolute right-0 p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-64px)]">
                    <div className="p-5 space-y-4">
                        <LocationSearch
                            value={formData.location}
                            onLocationSelect={(location) =>
                                handleInputChange('location', location)
                            }
                        />

                        <DatePicker
                            value={formData.activityDate}
                            onChange={(date) =>
                                handleInputChange('activityDate', date)
                            }
                        />

                        <ColorLevelSelect
                            value={formData.level}
                            onChange={(level) =>
                                handleInputChange('level', level)
                            }
                        />

                        <textarea
                            placeholder="* 내용"
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            className="w-full h-[150px] p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#735BF2]"
                        />

                        <ImageUpload
                            images={formData.images}
                            onChange={(images) => handleInputChange('images', images)}
                        />

                        <div className="flex gap-2 mt-5 mb-5">
                            {(['전체 공개', '팔로워 공개', '나만보기'] as PrivacyType[]).map((privacy) => (
                                <button
                                    key={privacy}
                                    onClick={() => handleInputChange('privacy', privacy)}
                                    className={`flex-1 py-2 px-3 rounded-full border ${
                                        formData.privacy === privacy
                                            ? 'bg-[#735BF2] border-[#735BF2] text-white'
                                            : 'border-gray-200 text-gray-500'
                                    }`}
                                >
                                    {privacy}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full py-4 bg-[#735BF2] text-white rounded-xl font-semibold disabled:bg-opacity-50"
                        >
                            등록
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}