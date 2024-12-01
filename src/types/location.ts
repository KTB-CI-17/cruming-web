export interface LocationDocument {
    place_name: string;
    road_address_name: string;
    address_name: string;
    phone: string;
    place_url: string;
    category_name: string;
    x: string;  // longitude
    y: string;  // latitude
}

export interface LocationMeta {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
    same_name: {
        keyword: string;
        region: string[];
        selected_region: string;
    };
}

export interface KakaoKeywordResponse {
    meta: LocationMeta;
    documents: LocationDocument[];
}

export interface LocationData {
    placeName: string;
    roadAddress: string;
}

export interface LocationSearchProps {
    value: string;
    onLocationSelect: (location: LocationData) => void;
}