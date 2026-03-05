import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Button, Text, ActionIcon, Box, Transition } from '@mantine/core';
import { X, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useVehicleStore } from '../../store/useVehicleStore';

export default function CompareBar() {
    const compareList = useAppStore((s) => s.compareList);
    const removeFromCompare = useAppStore((s) => s.removeFromCompare);
    const clearCompare = useAppStore((s) => s.clearCompare);
    const getVehicleById = useVehicleStore((s) => s.getVehicleById);
    const navigate = useNavigate();

    const vehicles = compareList.map((id) => getVehicleById(id)).filter(Boolean);

    return (
        <Transition mounted={compareList.length > 0} transition="slide-up" duration={280}>
            {(styles) => (
                <Box
                    style={{
                        ...styles,
                        position: 'fixed',
                        bottom: 0, left: 0, right: 0,
                        background: 'rgba(20,21,23,0.97)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderTop: '1px solid rgba(0,200,117,0.25)',
                        zIndex: 500,
                        boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
                        padding: '12px 32px',
                    }}
                >
                    <Group justify="space-between" align="center" maw={1440} mx="auto">
                        {/* Slots */}
                        <Group gap="md">
                            {[0, 1].map((slot) => {
                                const v = vehicles[slot];
                                return (
                                    <Box
                                        key={slot}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            padding: '8px 14px',
                                            background: v ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                                            border: `1px solid ${v ? 'rgba(0,200,117,0.25)' : 'rgba(255,255,255,0.07)'}`,
                                            borderRadius: 10,
                                            minWidth: 180,
                                            height: 52,
                                        }}
                                    >
                                        {v ? (
                                            <>
                                                <Box
                                                    style={{
                                                        width: 36, height: 36, borderRadius: 6,
                                                        backgroundColor: v.thumbnailColor,
                                                        overflow: 'hidden', flexShrink: 0,
                                                    }}
                                                >
                                                    <img
                                                        src={v.image} alt=""
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                </Box>
                                                <Box style={{ flex: 1 }}>
                                                    <Text fz={13} fw={600} c="white" lh={1.2}>{v.make} {v.model}</Text>
                                                    <Text fz={11} c="dimmed">{v.year}</Text>
                                                </Box>
                                                <ActionIcon
                                                    size="sm" variant="subtle" color="gray"
                                                    onClick={() => removeFromCompare(v.id)}
                                                    aria-label={`Remove ${v.make}`}
                                                >
                                                    <X size={13} />
                                                </ActionIcon>
                                            </>
                                        ) : (
                                            <Text fz={12} c="dimmed" style={{ fontStyle: 'italic' }}>
                                                {slot === 0 ? 'Select first vehicle' : 'Select second vehicle'}
                                            </Text>
                                        )}
                                    </Box>
                                );
                            })}
                        </Group>

                        {/* Actions */}
                        <Group gap="sm">
                            {compareList.length === 2 && (
                                <Button
                                    color="brand"
                                    radius="md"
                                    rightSection={<ArrowRight size={14} />}
                                    fw={700}
                                    onClick={() => navigate('/compare')}
                                >
                                    Compare Now
                                </Button>
                            )}
                            <Button
                                variant="subtle"
                                color="gray"
                                size="sm"
                                onClick={clearCompare}
                            >
                                Clear All
                            </Button>
                        </Group>
                    </Group>
                </Box>
            )}
        </Transition>
    );
}
