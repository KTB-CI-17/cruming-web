import { useState, useCallback } from 'react';
import {
    LocationDocument,
    KakaoKeywordResponse,
    LocationData
} from '../../types/location';

const RESULTS_PER_PAGE = 15;

interface UseKakaoLocationSearch {
    searchText: string;
    setSearchText: (text: string) => void;  // 추가됨
    searchResults: LocationDocument[];
    isLoading: boolean;
    isSearching: boolean;
    hasMore: boolean;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    handleSearch: (e: React.FormEvent) => Promise<void>;
    handleLoadMore: () => void;
    handleLocationSelect: (location: LocationDocument) => LocationData;
}

export const useKakaoLocationSearch = (
    initialValue: string,
    onLocationSelect: (location: LocationData) => void
): UseKakaoLocationSearch => {
    const [searchText, setSearchText] = useState(initialValue);
    const [searchResults, setSearchResults] = useState<LocationDocument[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const resetSearch = useCallback(() => {
        setSearchResults([]);
        setPage(1);
        setHasMore(true);
    }, []);

    const searchAddress = useCallback(async (
        pageNumber: number = 1,
        isNewSearch: boolean = true
    ) => {
        if (isLoading || (pageNumber > 1 && !hasMore)) return;

        try {
            setIsLoading(true);
            if (isNewSearch) {
                setIsSearching(true);
            }

            const response = await fetch(
                `https://dapi.kakao.com/v2/local/search/keyword?query=${
                    encodeURIComponent(searchText)
                }&page=${pageNumber}&size=${RESULTS_PER_PAGE}`,
                {
                    method: 'GET',
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('주소 검색 실패');
            }

            const data: KakaoKeywordResponse = await response.json();

            if (isNewSearch) {
                setSearchResults(data.documents);
                setShowModal(true);
            } else {
                setSearchResults(prev => [...prev, ...data.documents]);
            }

            setHasMore(
                !data.meta.is_end &&
                data.meta.pageable_count > pageNumber * RESULTS_PER_PAGE
            );

            setPage(pageNumber);

        } catch (error) {
            console.error('주소 검색 중 오류 발생:', error);
            if (isNewSearch) {
                resetSearch();
            }
        } finally {
            setIsLoading(false);
            if (isNewSearch) {
                setIsSearching(false);
            }
        }
    }, [searchText, isLoading, hasMore, resetSearch]);

    const handleSearch = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchText.trim()) {
            await searchAddress(1, true);
        }
    }, [searchAddress, searchText]);

    const handleLoadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            searchAddress(page + 1, false);
        }
    }, [searchAddress, isLoading, hasMore, page]);

    const handleLocationSelect = useCallback((location: LocationDocument) => {
        setSearchText(location.place_name);
        setShowModal(false);
        resetSearch();

        const locationData: LocationData = {
            placeName: location.place_name,
            address: location.road_address_name,
            latitude: parseFloat(location.y),
            longitude: parseFloat(location.x)
        };
        onLocationSelect(locationData);
        return locationData;
    }, [onLocationSelect, resetSearch]);

    return {
        searchText,
        setSearchText,  // 리턴 객체에 추가
        searchResults,
        isLoading,
        isSearching,
        hasMore,
        showModal,
        setShowModal,
        handleSearch,
        handleLoadMore,
        handleLocationSelect,
    };
};