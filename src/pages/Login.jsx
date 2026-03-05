import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Text, TextInput, PasswordInput, Button, Group, Stack } from '@mantine/core';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);
    const showToast = useAppStore((s) => s.showToast);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        setLoading(true);

        // Simulate network delay for UI polish
        await new Promise(r => setTimeout(r, 600));

        const success = login(username, password);

        setLoading(false);

        if (success) {
            showToast('Welcome back, Admin!', 'success');
            navigate('/');
        } else {
            setError('Invalid credentials. (Hint: admin / admin123)');
        }
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-base)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background effects */}
            <Box style={{
                position: 'absolute', top: '20%', left: '10%', width: 500, height: 500,
                background: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', filter: 'blur(100px)'
            }} />
            <Box style={{
                position: 'absolute', bottom: '10%', right: '10%', width: 600, height: 600,
                background: 'rgba(0, 200, 117, 0.03)', borderRadius: '50%', filter: 'blur(120px)'
            }} />

            <Container size={420} style={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    radius="xl"
                    p="xl"
                    withBorder
                    style={{
                        background: 'rgba(13, 17, 23, 0.7)',
                        backdropFilter: 'blur(20px)',
                        borderColor: 'rgba(255,255,255,0.08)',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
                    }}
                >
                    <Stack align="center" ta="center" mb="xl">
                        <Group gap={8}>
                            <img src="/favicon.svg" alt="AutoGenesis" style={{ height: 32 }} />
                            <Text ff="var(--font-display)" fz={28} c="white" lts="0.05em">
                                AUTO<span style={{ color: '#3b82f6' }}>GENESIS</span>
                            </Text>
                        </Group>
                        <Text c="dimmed" fz="sm" mt={-4}>
                            Sign in to access fleet management tools.
                        </Text>
                    </Stack>

                    <form onSubmit={handleLogin}>
                        <Stack gap="md">
                            <TextInput
                                label="Username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.currentTarget.value)}
                                radius="md"
                                size="md"
                                required
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                radius="md"
                                size="md"
                                required
                            />

                            {error && (
                                <Group gap={8} style={{ color: 'var(--red)' }} mt="-xs">
                                    <AlertCircle size={14} />
                                    <Text fz="sm">{error}</Text>
                                </Group>
                            )}

                            <Text fz="xs" c="dimmed" ta="center" mt="xs">
                                For this demo, use: <b>admin</b> / <b>admin123</b>
                            </Text>

                            <Button
                                type="submit"
                                fullWidth
                                mt="md"
                                size="lg"
                                radius="xl"
                                color="brand"
                                loading={loading}
                                rightSection={!loading && <ArrowRight size={18} />}
                                style={{ boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}
                            >
                                Login
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}
