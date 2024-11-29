export const COLORS = {
    PRIMARY: '#735BF2',
    GRAY: {
        100: '#F7F9FC',
        200: '#EDF1F7',
        300: '#E4E9F2',
        400: '#C5CEE0',
        500: '#8F9BB3',
        600: '#2E3A59'
    },
    WHITE: '#FFFFFF',
    BLACK: '#222222'
} as const;

export const FONT = {
    SIZES: {
        xs: '0.625rem',    // 10px
        sm: '0.75rem',     // 12px
        base: '0.875rem',  // 14px
        lg: '1rem',        // 16px
        xl: '1.125rem',    // 18px
        '2xl': '1.75rem',  // 28px
    },
    WEIGHTS: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    }
} as const;

export const TRANSITIONS = {
    DEFAULT: 'all 0.3s ease'
} as const;

export const SHADOWS = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
} as const;