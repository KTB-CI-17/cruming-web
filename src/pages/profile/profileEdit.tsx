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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const editRequest: UserEditRequest = {
            nickname: formData.nickname,
            height: formData.height,
            armReach: formData.armReach,
            intro: formData.intro,
            instagramId: formData.instagramId,
            homeGymRequest: formData.homeGym ? {
                placeName: formData.homeGym.placeName,
                address: formData.homeGym.address,
                latitude: formData.homeGym.latitude,
                longitude: formData.homeGym.longitude
            } : undefined
        };

        try {
            await updateProfile(editRequest);
            navigate('/profile');
        } catch (error) {
            console.error(error);
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
                <div className="flex flex-col gap-6"> {/* form을 div로 변경 */}
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
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">SNS Link</label>
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
                            {formData.homeGym && (
                                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-900">{formData.homeGym.placeName}</p>
                                    <p className="text-xs text-gray-500">{formData.homeGym.address}</p>
                                </div>
                            )}
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