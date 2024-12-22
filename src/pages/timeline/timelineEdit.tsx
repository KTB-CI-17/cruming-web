import {useEffect, useState} from "react";
import { LocationData } from '../../types/location';
import {PostFile, UploadImage} from "../../types/community";
import {useNavigate, useParams} from "react-router-dom";
import {api} from "../../config/axios";
import {colorLevelOptions, TimelineFormData} from "../../types/timeline";
import {PADDING} from "../../constants/layout";
import LocationSearch from "../../components/common/LocationSearch";
import DatePicker from "../../components/timeline/new/DatePicker";
import ColorLevelSelect from "../../components/timeline/new/ColorLevelSelect";
import {ImageUploadArea} from "../../components/community/new/ImageUploadArea";

type ServerVisibility = 'PUBLIC' | 'FOLLOWER' | 'PRIVATE';
type ClientVisibility = '전체 공개' | '팔로워 공개' | '나만보기';

const visibilityMap: Record<ServerVisibility, ClientVisibility> = {
    'PUBLIC': '전체 공개',
    'FOLLOWER': '팔로워 공개',
    'PRIVATE': '나만보기'
} as const;

const visibilityMapReverse: Record<ClientVisibility, ServerVisibility> = {
    '전체 공개': 'PUBLIC',
    '팔로워 공개': 'FOLLOWER',
    '나만보기': 'PRIVATE'
} as const;

export default function TimelineEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeline, setTimeline] = useState<TimelineFormData | null>(null);
    const [images, setImages] = useState<UploadImage[]>([]);
    const [deleteFileIds, setDeleteFileIds] = useState<number[]>([]);

    const handleInputChange = (field: string, value: any) => {
        setTimeline(prev => prev ? {...prev, [field]: value} : null);
    };

    const handleImagesChange = (newImages: UploadImage[]) => {
        const deletedImages = images.filter(img =>
            img.id && !newImages.find(newImg => newImg.id === img.id)
        );

        deletedImages.forEach(img => {
            if (img.id !== undefined) {
                setDeleteFileIds(prev => [...prev, img.id!]);
            }
        });

        setImages(newImages);
    };

    const handleSubmit = async () => {
        if (!timeline || !timeline.location) return;

        try {
            setIsSubmitting(true);

            const formData = new FormData();

            const requestData = {
                location: {
                    placeName: timeline.location.placeName,
                    address: timeline.location.address,
                    latitude: timeline.location.latitude,
                    longitude: timeline.location.longitude
                },
                level: timeline.level,
                content: timeline.content,
                visibility: visibilityMapReverse[timeline.visibility as ClientVisibility],
                activityAt: timeline.activityAt,
                deleteFileIds: deleteFileIds,
                newFiles: images
                    .filter(img => !img.isFixed && img.file)
                    .map((img, index) => ({
                        originalFileName: img.file?.name || '',
                        displayOrder: index + 1
                    }))
            };

            formData.append('request', new Blob([JSON.stringify(requestData)], {
                type: 'application/json'
            }));

            images
                .filter(img => !img.isFixed && img.file)
                .forEach(img => {
                    if (img.file) {
                        formData.append('files', img.file);
                    }
                });

            await api.patch(`/timelines/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate(-1);
        } catch (error) {
            console.error('Failed to update timeline: ', error);
            alert('타임라인 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/timelines/edit/${id}`);
                const timelineData = response.data;

                const matchingLevel = colorLevelOptions.find(option => option.value === timelineData.level);

                setTimeline({
                    ...timelineData,
                    visibility: visibilityMap[timelineData.visibility as ServerVisibility],
                    level: matchingLevel ? matchingLevel.value : colorLevelOptions[0].value
                });

                if (timelineData.files) {
                    const uploadImages: UploadImage[] = timelineData.files.map((file: PostFile) => ({
                        file: new File([], file.fileName),
                        preview: file.url,
                        id: file.id,
                        isFixed: true
                    }));
                    setImages(uploadImages);
                }
            } catch (error) {
                console.error('Failed to fetch post: ', error);
                alert('타임라인을 불러오는데 실패했습니다.');
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id, navigate]);

    if (isLoading || !timeline) {
        return <div className="min-h-screen bg-white" />;
    }

    const handleLocationSelect = (location: LocationData) => {
        handleInputChange('location', location);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="p-4 border-t">
                <div
                    style={{
                        padding: `${PADDING.MAIN.TOP} ${PADDING.MAIN.HORIZONTAL}`
                    }}
                    className="space-y-4"
                >
                    <LocationSearch
                        value={timeline.location?.placeName || ''}
                        onLocationSelect={handleLocationSelect}
                    />

                    <DatePicker
                        value={timeline.activityAt}
                        onChange={(date) =>
                            handleInputChange('activityAt', date)
                        }
                    />

                    <ColorLevelSelect
                        value={timeline.level}
                        onChange={(level) =>
                            handleInputChange('level', level)
                        }
                    />

                    <textarea
                        placeholder="* 내용"
                        value={timeline.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        className="w-full h-[150px] p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#735BF2]"
                    />

                    <ImageUploadArea
                        images={images}
                        onImagesChange={handleImagesChange}
                        disabled={isSubmitting}
                    />

                    <div className="flex gap-2 mt-5 mb-5">
                        {(['전체 공개', '팔로워 공개', '나만보기'] as const).map((visibilityOption) => (
                            <button
                                key={visibilityOption}
                                onClick={() => handleInputChange('visibility', visibilityOption)}
                                className={`flex-1 py-2 px-3 rounded-full border ${
                                    timeline.visibility === visibilityOption
                                        ? 'bg-[#735BF2] border-[#735BF2] text-white'
                                        : 'border-gray-200 text-gray-500'
                                }`}
                            >
                                {visibilityOption}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !timeline.content}
                    className="w-full bg-primary text-white px-0 py-4 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    완료
                </button>
            </div>
        </div>
    );
}