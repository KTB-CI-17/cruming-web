import { useState } from 'react';
import { X } from 'lucide-react';
import { TimelineFormData, TimelineRequest, VisibilityType } from '../../../types/timeline';
import { LocationData } from '../../../types/location';
import { LAYOUT, PADDING } from '../../../constants/layout';
import DatePicker from './DatePicker';
import ColorLevelSelect from './ColorLevelSelect';
import LocationSearch from "../../common/LocationSearch";
import { multipartApi } from "../../../config/axios";
import {UploadImage} from "../../../types/community";
import {ImageUploadArea} from "../../community/new/ImageUploadArea";

interface TimelineWriteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateSuccess: () => void;
}

const initialFormData: TimelineFormData = {
    location: null,
    activityAt: '',
    level: '',
    content: '',
    images: [],
    visibility: '전체 공개'
};

export default function TimelineWriteModal({ isOpen, onClose, onCreateSuccess }: TimelineWriteModalProps) {
    const [formData, setFormData] = useState<TimelineFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationText, setLocationText] = useState('');  // LocationSearch 컴포넌트용

    const validateForm = () => {
        if (!formData.location) {
            alert('위치를 입력해주세요.');
            return false;
        }

        const requiredFields: { field: keyof TimelineFormData; label: string }[] = [
            { field: 'activityAt', label: '활동 일자' },
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
            formData.location !== null ||
            formData.activityAt !== '' ||
            formData.level !== '' ||
            formData.content.trim() !== '' ||
            formData.images.length > 0 ||
            formData.visibility !== '전체 공개'
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

    const handleImagesChange = (newImages: UploadImage[]) => {
        const removedImages = formData.images.filter(
            img => !newImages.find(newImg => newImg.preview === img.preview)
        );
        removedImages.forEach(img => {
            URL.revokeObjectURL(img.preview);
        });

        handleInputChange('images', newImages);
    };

    const resetAndClose = () => {
        formData.images.forEach(image => {
            URL.revokeObjectURL(image.preview);
        });

        setFormData(initialFormData);
        setLocationText('');
        setIsSubmitting(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!validateForm() || !formData.location) return;

        if (confirm("입력하신 내용으로 등록하시겠습니까?")) {
            setIsSubmitting(true);
            try {
                const multipartFormData = new FormData();

                // visibility 변환
                const visibilityMapping: Record<VisibilityType, string> = {
                    '전체 공개': 'PUBLIC',
                    '팔로워 공개': 'FOLLOWER',
                    '나만보기': 'PRIVATE'
                };

                const requestData: TimelineRequest = {
                    location: formData.location,
                    activityAt: formData.activityAt.split('T')[0],
                    level: formData.level,
                    content: formData.content.trim(),
                    visibility: visibilityMapping[formData.visibility], // visibility 변환
                    fileRequests: formData.images.map((image, index) => ({
                        originalFileName: image.file.name,
                        displayOrder: index
                    }))
                };

                console.log(requestData); // 요청 데이터 확인

                multipartFormData.append('request', new Blob([JSON.stringify(requestData)], {
                    type: 'application/json'
                }));

                formData.images.forEach(image => {
                    multipartFormData.append('files', image.file);
                });

                const response = await multipartApi.post('/timelines', multipartFormData);
                console.log('Timeline created:', response.data);
                onCreateSuccess();
                resetAndClose();
            } catch (error) {
                console.error('Failed to create timeline:', error);
                alert('등록에 실패했습니다. 다시 시도해주세요.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleLocationSelect = (location: LocationData) => {
        setLocationText(location.placeName);
        setFormData(prev => ({
            ...prev,
            location: location
        }));
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
            <div
                style={{
                    maxWidth: LAYOUT.MAX_CONTENT_WIDTH,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    height: `calc(90vh - ${LAYOUT.TAB_BAR_HEIGHT})`
                }}
                className="fixed inset-x-0 bottom-0 bg-white rounded-t-[20px] overflow-hidden"
            >
                <div
                    style={{
                        padding: `${PADDING.MAIN.TOP} ${PADDING.MAIN.HORIZONTAL}`
                    }}
                    className="border-b border-gray-200"
                >
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

                <div
                    style={{
                        height: `calc(90vh - ${LAYOUT.TAB_BAR_HEIGHT} - 64px)`,
                        paddingBottom: PADDING.MAIN.BOTTOM
                    }}
                    className="overflow-y-auto"
                >
                    <div
                        style={{
                            padding: `${PADDING.MAIN.TOP} ${PADDING.MAIN.HORIZONTAL}`
                        }}
                        className="space-y-4"
                    >
                        <LocationSearch
                            value={locationText}
                            onLocationSelect={handleLocationSelect}
                        />

                        <DatePicker
                            value={formData.activityAt}
                            onChange={(date) =>
                                handleInputChange('activityAt', date)
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

                        <ImageUploadArea
                            images={formData.images}
                            onImagesChange={handleImagesChange}
                            disabled={isSubmitting}
                        />

                        <div className="flex gap-2 mt-5 mb-5">
                            {(['전체 공개', '팔로워 공개', '나만보기'] as VisibilityType[]).map((visibility) => (
                                <button
                                    key={visibility}
                                    onClick={() => handleInputChange('visibility', visibility)}
                                    className={`flex-1 py-2 px-3 rounded-full border ${
                                        formData.visibility === visibility
                                            ? 'bg-[#735BF2] border-[#735BF2] text-white'
                                            : 'border-gray-200 text-gray-500'
                                    }`}
                                >
                                    {visibility}
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