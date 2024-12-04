export const LAYOUT = {
    HEADER_HEIGHT: '60px',
    TAB_BAR_HEIGHT: '60px',
    MAX_CONTENT_WIDTH: '500px',
    MAX_CONTENT_HEIGHT: '1000px',
    SAFE_TOP: 'env(safe-area-inset-top)',
    SAFE_BOTTOM: 'env(safe-area-inset-bottom)'
} as const;

export const PADDING = {
    HEADER: '1rem',
    CONTENT: '1rem',
    MAIN: {
        TOP: '1rem',
        BOTTOM: '1rem',
        HORIZONTAL: '1rem'
    }
} as const;

export const Z_INDEX = {
    HEADER: 50,
    TAB_BAR: 40,
    MODAL: 100
} as const;