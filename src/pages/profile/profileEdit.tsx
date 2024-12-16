import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import LocationSearch from '../../components/common/LocationSearch';
import { LocationData } from '../../types/location';

export default function ProfileEditPage() {
    const [selectedGym, setSelectedGym] = useState<LocationData | null>(null);

    const handleLocationSelect = (location: LocationData) => {
        setSelectedGym(location);
    };

    return (
        <div className="flex flex-col h-full bg-white page-container">
            <div className="max-w-screen-sm mx-auto w-full pt-6">
                <div className="flex flex-col gap-6">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-purple-200 overflow-hidden">
                                <img
                                    src="/api/placeholder/112/112"
                                    alt="프로필 이미지"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border"
                                aria-label="이미지 변경"
                            >
                                <RefreshCw className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col gap-6 px-6">
                        <div>
                            <label className="text-sm text-gray-500">
                                닉네임
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#735BF2]"
                                placeholder="닉네임을 입력하세요"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">SNS Link</label>
                            <input
                                type="text"
                                className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#735BF2]"
                                placeholder="SNS 링크를 입력하세요"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500">키</label>
                                <input
                                    type="number"
                                    className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#735BF2]"
                                    placeholder="키"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">팔 길이</label>
                                <input
                                    type="number"
                                    className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#735BF2]"
                                    placeholder="팔 길이"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">관심 암장</label>
                            <div className="mt-1">
                                <LocationSearch
                                    value={selectedGym?.placeName || ''}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>
                            {selectedGym && (
                                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-900">{selectedGym.placeName}</p>
                                    <p className="text-xs text-gray-500">{selectedGym.address}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">한줄 소개</label>
                            <textarea
                                className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#735BF2] resize-none"
                                rows={4}
                                placeholder="자신을 소개해주세요"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full p-3 bg-[#735BF2] text-white rounded-lg hover:bg-[#5D4ACC] transition-colors"
                        >
                            저장하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}