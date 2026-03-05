import React, { useState, useEffect } from 'react';
import { Box, Text, Progress } from '@mantine/core';

export default function LoadingScreen({ onComplete }) {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animate progress bar
        const p1 = setTimeout(() => setProgress(60), 300);
        const p2 = setTimeout(() => setProgress(100), 900);
        const fade = setTimeout(() => setFadeOut(true), 1200);
        const done = setTimeout(() => { setVisible(false); onComplete?.(); }, 1700);
        return () => [p1, p2, fade, done].forEach(clearTimeout);
    }, [onComplete]);

    if (!visible) return null;

    return (
        <Box
            style={{
                position: 'fixed',
                inset: 0,
                background: 'var(--ag-bg-base)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                opacity: fadeOut ? 0 : 1,
                transition: 'opacity 0.5s ease',
                gap: 24,
            }}
        >
            <img src="/favicon.svg" alt="logo" style={{ width: 52, filter: 'brightness(0) invert(1)', animation: 'breathe 1.5s ease-in-out infinite' }} />
            <Text
                ff="var(--font-display)"
                fz={28}
                style={{ letterSpacing: '0.1em', color: '#f0f0f0' }}
            >
                AUTO<span style={{ color: 'var(--ag-green)' }}>GENESIS</span>
            </Text>
            <Text fz={12} c="dimmed" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Loading Passport Data...
            </Text>
            <Box style={{ width: 200 }}>
                <Progress
                    value={progress}
                    size="xs"
                    color="brand"
                    style={{ transition: 'all 0.6s ease' }}
                />
            </Box>

            <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
        </Box>
    );
}
