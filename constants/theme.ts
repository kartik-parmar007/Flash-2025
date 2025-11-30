export const COLORS = {
    background: ['#0f0c29', '#302b63', '#24243e'] as const,
    primary: '#6366f1',
    secondary: '#00d2ff',
    accent: '#f59e0b',
    success: '#10b981',
    error: '#ef4444',
    text: {
        primary: '#ffffff',
        secondary: '#b3b3b3',
        muted: '#9ca3af',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: 'rgba(255, 255, 255, 0.1)',
    },
    glass: {
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'rgba(255, 255, 255, 0.2)',
    }
};

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
};

export const FONTS = {
    regular: 'System',
    bold: 'System', // You can replace with custom fonts if added
};

export const COMMON_STYLES = {
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    glassContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
    }
};
