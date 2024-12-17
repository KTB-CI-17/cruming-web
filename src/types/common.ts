export interface PageableSort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: PageableSort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Page<T> {
    content: T[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: PageableSort;
    numberOfElements: number;
    empty: boolean;
} 