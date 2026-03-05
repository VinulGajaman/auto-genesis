import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, Text, Button, Group, SimpleGrid, Badge, Box, Avatar } from '@mantine/core';
import { LogOut, Edit, ArrowLeft, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { getCustomVehicles } from '../utils/vehicleStorage';

export default function Profile() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    // If suddenly logged out, bounce to home
    if (!user) {
        navigate('/');
        return null;
    }

    const customVehicles = getCustomVehicles();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Container size="lg" py="xl" style={{ marginTop: 80 }}>
                <Button variant="subtle" color="gray" leftSection={<ArrowLeft size={16} />} onClick={() => navigate('/')} mb="lg">
                    Back to Gallery
                </Button>

                <Group align="flex-start" justify="space-between" mb="xl">
                    <Group>
                        <Avatar size={72} radius="xl" color="brand">
                            <UserCircle2 size={40} />
                        </Avatar>
                        <div>
                            <Title order={1} c="white" ff="var(--font-display)">{user.name}</Title>
                            <Badge variant="light" color="blue" size="sm" mt={4}>
                                @{user.username} • {user.role}
                            </Badge>
                        </div>
                    </Group>
                    <Button variant="outline" color="red" leftSection={<LogOut size={16} />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Group>

                <Paper radius="xl" p="xl" withBorder style={{
                    background: 'rgba(13, 17, 23, 0.5)',
                    borderColor: 'rgba(255,255,255,0.05)'
                }}>
                    <Group justify="space-between" mb="lg">
                        <Title order={3} c="white">My Vehicles</Title>
                        <Button variant="light" color="brand" onClick={() => navigate('/add-vehicle')}>
                            + Add New Vehicle
                        </Button>
                    </Group>

                    {customVehicles.length === 0 ? (
                        <Box py="xl" ta="center">
                            <Text c="dimmed">You haven't entered any custom vehicles yet.</Text>
                            <Button variant="outline" mt="md" onClick={() => navigate('/add-vehicle')}>
                                Create your first Vehicle Passport
                            </Button>
                        </Box>
                    ) : (
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                            {customVehicles.map(v => (
                                <Paper key={v.id} p="md" radius="md" withBorder style={{
                                    background: '#1A1B1E',
                                    borderColor: 'rgba(255,255,255,0.08)'
                                }}>
                                    <Group justify="space-between" mb="xs">
                                        <Text fw={600} c="white">{v.make} {v.model}</Text>
                                        <Badge size="xs" color="gray">{v.id}</Badge>
                                    </Group>
                                    <Text fz="sm" c="dimmed" mb="md">{v.year} • {v.color}</Text>

                                    <Button
                                        fullWidth
                                        variant="light"
                                        color="brand"
                                        size="sm"
                                        leftSection={<Edit size={14} />}
                                        onClick={() => navigate(`/edit-vehicle/${v.id}`)}
                                    >
                                        Edit Record
                                    </Button>
                                </Paper>
                            ))}
                        </SimpleGrid>
                    )}
                </Paper>
            </Container>
        </motion.div>
    );
}
