import { RefreshCw, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationSearch from '../../components/common/LocationSearch';
import { UserEditRequest } from '../../types/user';
import {useEditProfile} from "../../hooks/profile/useEditProfile";

export default function ProfileEditPage() {
    const navigate = useNavigate();
    const {
        formData: formData,
        loading,
        submitting,
        updateProfileImage,
        updateProfile,
        handleLocationSelect,
        handleInputChange,
        handleNumberInputChange
    } = useEditProfile();

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            await updateProfileImage(file);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (submitting) return; // 중복 제출 방지

        try {
            // 닉네임 검증
            if (!formData.nickname?.trim()) {
                alert('닉네임을 입력해주세요.');
                return;
            }

            // 값 검증 및 변환
            let processedHeight = null;
            let processedArmReach = null;

            if (formData.height !== undefined && formData.height !== null) {
                const height = Number(formData.height);
                if (height <= 30 || height >= 300) {
                    alert('키는 30cm에서 300cm 사이여야 합니다.');
                    return;
                }
                processedHeight = height;
            }

            if (formData.armReach !== undefined && formData.armReach !== null) {
                const armReach = Number(formData.armReach);
                if (armReach <= 30 || armReach >= 300) {
                    alert('팔 길이는 30cm에서 300cm 사이여야 합니다.');
                    return;
                }
                processedArmReach = armReach;
            }

            const request: UserEditRequest = {
                nickname: formData.nickname.trim(),
                height: processedHeight || undefined,  // null 대신 undefined 사용
                armReach: processedArmReach || undefined,  // null 대신 undefined 사용
                intro: formData.intro ? formData.intro.trim() : undefined,  // null 대신 undefined 사용
                instagramId: formData.instagramId ? formData.instagramId.trim() : undefined,  // null 대신 undefined 사용
                homeGymRequest: formData.homeGym ? {
                    placeName: formData.homeGym.placeName.trim(),
                    address: formData.homeGym.address.trim(),
                    latitude: formData.homeGym.latitude,
                    longitude: formData.homeGym.longitude
                } : undefined  // null 대신 undefined 사용
            };

            await updateProfile(request);
            navigate('/profile');
        } catch (error) {
            alert(error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin" size={24} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white page-container">
            <div className="max-w-screen-sm mx-auto w-full pt-6">
                <div className="flex flex-col gap-6">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-purple-200 overflow-hidden">
                                <img
                                    src={formData.profileImageUrl || "/api/placeholder/112/112"}
                                    alt="프로필 이미지"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label
                                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border cursor-pointer"
                                aria-label="이미지 변경"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    disabled={submitting}
                                />
                                <RefreshCw className="w-5 h-5 text-gray-600" />
                            </label>
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
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleInputChange}
                                className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#735BF2]"
                                placeholder="닉네임을 입력하세요"
                                required
                                maxLength={50}
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">인스타그램 ID</label>
                            <input
                                type="text"
                                name="instagramId"
                                value={formData.instagramId || ''}
                                onChange={handleInputChange}
                                className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#735BF2]"
                                placeholder="인스타그램 ID를 입력하세요"
                                disabled={submitting}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500">키</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height || ''}
                                    onChange={handleNumberInputChange}
                                    className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#735BF2]"
                                    placeholder="키"
                                    disabled={submitting}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">팔 길이</label>
                                <input
                                    type="number"
                                    name="armReach"
                                    value={formData.armReach || ''}
                                    onChange={handleNumberInputChange}
                                    className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#735BF2]"
                                    placeholder="팔 길이"
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">관심 암장</label>
                            <div className="mt-1">
                                <LocationSearch
                                    value={formData.homeGym?.placeName || ''}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">한줄 소개</label>
                            <textarea
                                name="intro"
                                value={formData.intro || ''}
                                onChange={handleInputChange}
                                className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#735BF2] resize-none"
                                rows={4}
                                placeholder="자신을 소개해주세요"
                                disabled={submitting}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full p-3 bg-[#735BF2] text-white rounded-lg hover:bg-[#5D4ACC] transition-colors disabled:opacity-50"
                        >
                            {submitting ? '저장 중...' : '저장하기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}