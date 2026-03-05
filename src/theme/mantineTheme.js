import { createTheme, rem } from '@mantine/core';

export const mantineTheme = createTheme({
    /** Primary color mapped to our brand blue */
    primaryColor: 'brand',

    /** Force dark color scheme */
    defaultColorScheme: 'dark',

    colors: {
        brand: [
            '#eff6ff', // 0
            '#dbeafe', // 1
            '#bfdbfe', // 2
            '#93c5fd', // 3
            '#60a5fa', // 4
            '#3b82f6', // 5 — main brand blue
            '#2563eb', // 6
            '#1d4ed8', // 7
            '#1e40af', // 8
            '#1e3a8a', // 9
        ],
        dark: [
            '#e2e8f0', // 0 — text-primary
            '#cbd5e1', // 1
            '#94a3b8', // 2 — text-secondary
            '#64748b', // 3 — text-muted
            '#334155', // 4
            '#1e293b', // 5
            '#1a1f2e', // 6 — bg-elevated
            '#111827', // 7 — bg-surface
            '#0d1117', // 8 — bg-base
            '#080c12', // 9 — deepest bg
        ],
    },

    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    fontFamilyMonospace: "'DM Mono', 'Courier New', monospace",
    headings: {
        fontFamily: "'Bebas Neue', 'DM Sans', sans-serif",
        fontWeight: '400',
    },

    radius: {
        xs: rem(4),
        sm: rem(6),
        md: rem(10),
        lg: rem(16),
        xl: rem(24),
    },

    spacing: {
        xs: rem(8),
        sm: rem(12),
        md: rem(16),
        lg: rem(24),
        xl: rem(32),
    },

    defaultRadius: 'md',

    /** Component-level overrides */
    components: {
        // ── Input / TextInput / Select ──────────────────────────
        Input: {
            styles: {
                input: {
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'rgba(255,255,255,0.12)',
                    color: '#e2e8f0',
                    transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
                    '&:focus': {
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 2px rgba(59,130,246,0.15)',
                    },
                    '&::placeholder': {
                        color: '#64748b',
                    },
                },
            },
        },

        TextInput: { defaultProps: { size: 'sm' } },
        NumberInput: { defaultProps: { size: 'sm' } },
        Textarea: { defaultProps: { size: 'sm' } },
        FileInput: { defaultProps: { size: 'sm' } },
        PasswordInput: { defaultProps: { size: 'sm' } },

        // ── Select dropdown ─────────────────────────────────────
        Select: {
            defaultProps: { size: 'sm' },
            styles: {
                dropdown: {
                    backgroundColor: '#1a1f2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
                },
                option: {
                    '&[data-selected]': {
                        backgroundColor: 'rgba(59,130,246,0.15)',
                        color: '#60a5fa',
                    },
                    '&[data-hovered]': {
                        backgroundColor: 'rgba(255,255,255,0.05)',
                    },
                },
            },
        },

        // ── Button ───────────────────────────────────────────────
        Button: {
            defaultProps: { size: 'sm' },
            styles: {
                root: {
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    transition: 'transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        filter: 'brightness(1.15)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                    }
                },
            },
        },

        // ── Badge ────────────────────────────────────────────────
        Badge: {
            defaultProps: { size: 'sm' },
            styles: {
                root: { fontFamily: "'DM Sans', sans-serif" },
            },
        },

        // ── Card ─────────────────────────────────────────────────
        Card: {
            defaultProps: { padding: 'lg' },
            styles: {
                root: {
                    backgroundColor: 'rgba(17, 24, 39, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
                    '&:hover': {
                        backgroundColor: 'rgba(17, 24, 39, 0.7)',
                        borderColor: 'rgba(255,255,255,0.15)',
                    }
                },
            },
        },

        // ── Paper ────────────────────────────────────────────────
        Paper: {
            styles: {
                root: {
                    backgroundColor: 'rgba(17, 24, 39, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                },
            },
        },

        // ── Table ────────────────────────────────────────────────
        Table: {
            styles: {
                td: { padding: '10px 14px' },
                th: {
                    padding: '8px 14px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                },
            },
        },

        // ── Tabs ─────────────────────────────────────────────────
        Tabs: {
            styles: {
                tab: {
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: '13px',
                    color: '#64748b',
                    '&[data-active]': {
                        color: '#e2e8f0',
                        borderBottomColor: '#3b82f6',
                    },
                },
            },
        },

        // ── Stepper ──────────────────────────────────────────────
        Stepper: {
            styles: {
                stepIcon: {
                    backgroundColor: '#111827',
                    borderColor: 'rgba(255,255,255,0.12)',
                    '&[data-completed]': {
                        backgroundColor: '#3b82f6',
                        borderColor: '#3b82f6',
                    },
                    '&[data-progress]': {
                        borderColor: '#3b82f6',
                        color: '#3b82f6',
                    },
                },
                stepLabel: {
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '12px',
                },
                separator: {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&[data-active]': { backgroundColor: '#3b82f6' },
                },
            },
        },

        // ── Modal ────────────────────────────────────────────────
        Modal: {
            styles: {
                content: { backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)' },
                header: { backgroundColor: '#111827', borderBottom: '1px solid rgba(255,255,255,0.07)' },
                overlay: { backdropFilter: 'blur(4px)' },
            },
        },

        // ── Drawer ───────────────────────────────────────────────
        Drawer: {
            styles: {
                content: { backgroundColor: '#111827', border: 'none' },
                header: { backgroundColor: '#111827', borderBottom: '1px solid rgba(255,255,255,0.07)' },
                overlay: { backdropFilter: 'blur(4px)' },
            },
        },

        // ── Notification ─────────────────────────────────────────
        Notification: {
            styles: {
                root: {
                    backgroundColor: '#1a1f2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                },
            },
        },

        // ── Switch ───────────────────────────────────────────────
        Switch: {
            styles: {
                track: {
                    cursor: 'pointer',
                    '&[data-checked]': {
                        backgroundColor: '#3b82f6',
                        borderColor: '#3b82f6',
                    },
                },
            },
        },

        // ── Tooltip ──────────────────────────────────────────────
        Tooltip: {
            styles: {
                tooltip: {
                    backgroundColor: '#1a1f2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '12px',
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#ffffff',
                    fontWeight: 600,
                },
            },
        },
    },
});
