import { Search, Loader2, X } from 'lucide-react';
import {LocationData} from "../../types/location.ts";
import {useKakaoLocationSearch} from "../../hooks/useKakaoLocationSearch.ts";

interface LocationSearchProps {
    value?: string;
    onLocationSelect: (location: LocationData) => void;
}

export default function LocationSearch({ value = '', onLocationSelect }: LocationSearchProps) {
    const {
        searchText,
        setSearchText,
        searchResults,
        isLoading,
        isSearching,
        showModal,
        setShowModal,
        handleSearch,
        handleLoadMore,
        handleLocationSelect,
    } = useKakaoLocationSearch(value, onLocationSelect);

    return (
        <div className="w-full">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    placeholder="* 위치"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    disabled={isSearching}
                    className="w-full px-4 py-3 text-base border-b border-gray-100 focus:outline-none disabled:bg-gray-50 pr-12"
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 disabled:opacity-50"
                >
                    {isSearching ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Search className="h-5 w-5" />
                    )}
                </button>
            </form>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h2 className="text-lg font-medium">위치 검색 결과</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div
                            className="max-h-[60vh] overflow-y-auto"
                            onScroll={(e) => {
                                const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                                if (scrollHeight - scrollTop <= clientHeight * 1.5) {
                                    handleLoadMore();
                                }
                            }}
                        >
                            {searchResults.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {searchResults.map((item, index) => (
                                        <button
                                            key={`${item.place_name}-${index}`}
                                            onClick={() => handleLocationSelect(item)}
                                            className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <p className="font-medium text-gray-900">
                                                {item.place_name}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.road_address_name}
                                            </p>
                                        </button>
                                    ))}
                                    {isLoading && (
                                        <div className="py-4 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-gray-500">
                                    검색 결과가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}