import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Group, Stack, Text, Button, Paper, SimpleGrid,
    Modal, Divider, Badge,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ArrowLeft, ArrowLeftRight, ArrowRight } from 'lucide-react';
import { useVehicleStore } from '../../store/useVehicleStore';
import { useAppStore } from '../../store/useAppStore';
import { formatLKR, formatKm } from '../../utils/formatters';
import '../../styles/Swap.css';

function swapDelta(source, target) {
    const diff = target.market_value_lkr - source.market_value_lkr;
    if (Math.abs(diff) < 50000) return { label: 'Fair Trade ≈ Even Value', color: 'yellow' };
    if (diff > 0) return { label: `You pay top-up of ${formatLKR(Math.abs(diff))}`, color: 'red', amount: diff };
    return { label: `You receive ${formatLKR(Math.abs(diff))} credit`, color: 'green', amount: diff };
}

export default function Swap() {
    const { id } = useParams();
    const navigate = useNavigate();
    const showToast = useAppStore((s) => s.showToast);
    const vehicles = useVehicleStore((s) => s.vehicles);
    const getVehicleById = useVehicleStore((s) => s.getVehicleById);
    const source = getVehicleById(id);

    const [modalTarget, setModalTarget] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);

    if (!source) return (
        <Container py="xl" ta="center">
            <Text fz={20} fw={600} c="white" mb="md">Vehicle not found</Text>
            <Button color="brand" onClick={() => navigate('/')}>Back to Gallery</Button>
        </Container>
    );

    const options = vehicles.filter((v) => v.id !== source.id);

    const openModal = (target) => { setModalTarget(target); open(); };

    return (
        <Container size="lg" py="xl">
            {/* Header */}
            <Button variant="subtle" color="gray" leftSection={<ArrowLeft size={14} />}
                onClick={() => navigate('/')} mb="lg">
                Back to Gallery
            </Button>
            <Text ff="var(--font-display)" fz={36} c="white" mb={4}>Vehicle Swap</Text>
            <Text c="dimmed" mb="xl">Explore trade possibilities and see the value difference</Text>

            {/* Source card */}
            <Paper radius="lg" p={0} mb="xl" style={{ overflow: 'hidden', border: '1px solid rgba(0,200,117,0.2)' }}>
                <Group gap={0}>
                    <Box style={{ width: 200, height: 140, background: source.thumbnailColor, flexShrink: 0 }}>
                        <img src={source.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }} />
                    </Box>
                    <Stack gap={4} p="lg" style={{ flex: 1 }}>
                        <Badge size="xs" color="brand" variant="light" w="fit-content">Offering This Vehicle</Badge>
                        <Text ff="var(--font-display)" fz={24} c="white">{source.make} {source.model}</Text>
                        <Text fz={12} c="dimmed">{source.variant} · {source.year} · Grade {source.condition_grade} · {formatKm(source.mileage)}</Text>
                        <Text fz={18} fw={700} c="brand.4">{formatLKR(source.market_value_lkr)}</Text>
                    </Stack>
                </Group>
            </Paper>

            {/* Divider */}
            <Group gap="sm" mb="xl" justify="center">
                <Divider style={{ flex: 1 }} />
                <Group gap={6}>
                    <ArrowLeftRight size={16} color="#00C875" />
                    <Text fz={12} fw={700} tt="uppercase" lts="0.1em" c="brand.4">Swap With</Text>
                </Group>
                <Divider style={{ flex: 1 }} />
            </Group>

            {/* Options grid */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {options.map((target) => {
                    const delta = swapDelta(source, target);
                    const deltaColor = delta.color === 'green' ? 'green' : delta.color === 'red' ? 'red' : 'yellow';
                    return (
                        <Paper
                            key={target.id} radius="lg" p={0}
                            style={{
                                cursor: 'pointer', overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.07)',
                                transition: 'all 0.25s',
                            }}
                            onClick={() => openModal(target)}
                        >
                            <Box style={{ height: 120, background: target.thumbnailColor }}>
                                <img src={target.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.style.display = 'none'; }} />
                            </Box>
                            <Stack gap={6} p="md">
                                <Text ff="var(--font-display)" fz={20} c="white">{target.make} {target.model}</Text>
                                <Text fz={11} c="dimmed">{target.variant} · {target.year}</Text>
                                <Group justify="space-between">
                                    <Text fz={13} fw={700} c="white">{formatLKR(target.market_value_lkr)}</Text>
                                    <Badge size="sm" color={deltaColor} variant="light">{delta.label}</Badge>
                                </Group>
                                <Button size="xs" variant="outline" color="gray" mt={4} rightSection={<ArrowRight size={12} />} fullWidth>
                                    View Swap Details
                                </Button>
                            </Stack>
                        </Paper>
                    );
                })}
            </SimpleGrid>

            {/* Swap detail Modal */}
            {modalTarget && (
                <Modal
                    opened={opened} onClose={close} centered size="lg" radius="lg"
                    title={<Text ff="var(--font-display)" fz={24} c="white">Swap Summary</Text>}
                    styles={{ body: { padding: 24 }, header: { background: '#1A1B1E', borderBottom: '1px solid rgba(255,255,255,0.07)' }, content: { background: '#1A1B1E' } }}
                >
                    {(() => {
                        const delta = swapDelta(source, modalTarget);
                        const deltaColor = delta.color === 'green' ? '#00C875' : delta.color === 'red' ? '#FF4545' : '#F5C842';
                        return (
                            <Stack gap="xl">
                                <SimpleGrid cols={2} spacing="md">
                                    {[
                                        { label: 'YOU GIVE', v: source, color: 'red' },
                                        { label: 'YOU RECEIVE', v: modalTarget, color: 'green' },
                                    ].map(({ label, v, color }) => (
                                        <Paper key={v.id} radius="md" p={0} style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                                            <Box style={{ height: 110, background: v.thumbnailColor }}>
                                                <img src={v.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => { e.target.style.display = 'none'; }} />
                                            </Box>
                                            <Stack gap={4} p="sm">
                                                <Badge size="xs" color={color === 'red' ? 'red' : 'green'} variant="light">{label}</Badge>
                                                <Text fz={14} fw={700} c="white">{v.make} {v.model}</Text>
                                                <Text fz={11} c="dimmed">{v.variant} · {v.year}</Text>
                                                <Text fz={15} fw={700} c="brand.4">{formatLKR(v.market_value_lkr)}</Text>
                                                <Text fz={10} c="dimmed">Grade {v.condition_grade} · {formatKm(v.mileage)}</Text>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </SimpleGrid>

                                <Paper radius="md" p="md" ta="center" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${deltaColor}33` }}>
                                    <Text fz={20} fw={800} style={{ color: deltaColor }}>{delta.label}</Text>
                                    <Text fz={12} c="dimmed" mt={4}>Grade: {source.condition_grade}/5 vs {modalTarget.condition_grade}/5 · Mileage: {formatKm(source.mileage)} vs {formatKm(modalTarget.mileage)}</Text>
                                </Paper>

                                <Group justify="center" gap="md">
                                    <Button color="brand" size="md" fw={700} radius="md"
                                        onClick={() => { showToast('Interest expressed! AutoGenesis will contact you.', 'success'); close(); }}>
                                        Express Interest
                                    </Button>
                                    <Button variant="subtle" color="gray" onClick={close}>Cancel</Button>
                                </Group>
                                <Text ta="center" fz={12} c="dimmed">Connect with AutoGenesis to finalize the swap</Text>
                            </Stack>
                        );
                    })()}
                </Modal>
            )}
        </Container>
    );
}
