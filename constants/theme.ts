export const COLORS = {
    background: ['#0f172a', '#1e293b', '#334155'] as const, // Dark Navy / Slate Gradient
    primary: '#0ea5e9', // Sky Blue (Agentic Cyan)
    secondary: '#818cf8', // Indigo/Purple
    accent: '#22d3ee', // Cyan Neon
    success: '#34d399', // Emerald
    error: '#f43f5e', // Rose
    warning: '#fbbf24', // Amber
    text: {
        primary: '#f1f5f9', // Slate 100 (White-ish)
        secondary: '#94a3b8', // Slate 400
        muted: '#64748b', // Slate 500
        accent: '#38bdf8', // Sky 400
        light: '#ffffff',
    },
    card: {
        background: 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity
        border: 'rgba(56, 189, 248, 0.2)', // Sky blue border, subtle
    },
    glass: {
        background: 'rgba(255, 255, 255, 0.03)',
        border: 'rgba(255, 255, 255, 0.05)',
        details: 'rgba(255, 255, 255, 0.02)',
    },
    gradients: {
        primary: ['#0ea5e9', '#6366f1'], // Sky to Indigo
        dark: ['#0f172a', '#1e293b', '#334155'],
        card: ['rgba(30, 41, 59, 0.8)', 'rgba(30, 41, 59, 0.4)'],
    }
};

export const SPACING = {
    xxs: 2,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

export const FONTS = {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    heavy: 'System',
};

export const COMMON_STYLES = {
    shadow: {
        shadowColor: '#38bdf8', // Cyan shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    glow: {
        shadowColor: '#38bdf8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 8,
    },
    glassContainer: {
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.2)',
        padding: 24,
    },
    screenContainer: {
        flex: 1,
        backgroundColor: '#0f172a',
    }
};
