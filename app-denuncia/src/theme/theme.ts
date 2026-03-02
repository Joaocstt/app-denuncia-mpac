export const theme = {
    colors: {
        primary: '#9C2B27',
        secondary: '#D0403A',
        background: '#F5F5F5',
        cardBackground: '#FFFFFF',
        text: '#333333',
        textLight: '#888888',
        white: '#FFFFFF',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C', // Added error color
        border: '#E0E0E0',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 20,
        round: 50,
    }
} as const;

export type Theme = typeof theme;
