import { useState, useEffect } from 'react';
import {UserEditInfo, UserEditRequest} from "../../types/user";
import {api} from "../../config/axios";
import {LocationData} from "../../types/location";

export const useEditProfile = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<UserEditInfo>({
        profileImageUrl: '',
        nickname: '',
        height: undefined,
        armReach: undefined,
        intro: '',
        instagramId: '',
        homeGym: null
    });

    const fetchUserEditInfo = async () => {
        try {
            setLoading(true);
            const response = await api.get<UserEditInfo>('/users/edit');
            setFormData(response.data);
        } catch (error) {
            console.error('Failed to fetch user info:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfileImage = async (file: File) => {
        const formData = new FormData();
        formData.append('newProfileImage', file);

        try {
            setSubmitting(true);
            await api.put('/users/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await fetchUserEditInfo();
        } catch (error) {
            console.error('Failed to update profile image:', error);
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const updateProfile = async (editRequest: UserEditRequest) => {
        try {
            setSubmitting(true);
            await api.put('/users/edit', editRequest);
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleLocationSelect = (location: LocationData) => {
        setFormData(prev => ({
            ...prev,
            homeGym: {
                placeName: location.placeName,
                address: location.address,
                latitude: location.latitude,
                longitude: location.longitude
            }
        }));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        const numberValue = value ? Number(value) : undefined;
        setFormData(prev => ({
            ...prev,
            [name]: numberValue
        }));
    };

    useEffect(() => {
        fetchUserEditInfo();
    }, []);

    return {
        formData,
        loading,
        submitting,
        updateProfileImage,
        updateProfile,
        handleLocationSelect,
        handleInputChange,
        handleNumberInputChange
    };
};