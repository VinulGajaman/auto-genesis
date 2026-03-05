import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Group, Stack, Text, Button, Badge, Container,
    Paper, SimpleGrid, Table, TextInput, Select,
} from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { ArrowLeft, CheckCircle2, XCircle, Check, BookOpen, Search } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useVehicleStore } from '../../store/useVehicleStore';
import { formatLKR, formatKm } from '../../utils/formatters';
import '../../styles/Compare.css';

function getAccidentCount(v) {
    return v.timeline?.filter((e) => e.phase === 'accident').length || 0;
}

function getWinner(key, v1, v2) {
    const higherIsBetter = ['year', 'condition_grade', 'market_value_lkr'];
    const lowerIsBetter = ['age', 'mileage'];
    const val1 = v1[key];
    const val2 = v2[key];
    if (val1 === val2 || (!val1 && !val2)) return 'tie';
    if (higherIsBetter.includes(key)) return val1 > val2 ? 'left' : 'right';
    if (lowerIsBetter.includes(key)) return val1 < val2 ? 'left' : 'right';
    return 'tie';
}

export default function Compare() {
    const navigate = useNavigate();
    const compareList = useAppStore((s) => s.compareList);
    const addToCompare = useAppStore((s) => s.addToCompare);
    const removeFromCompare = useAppStore((s) => s.removeFromCompare);
    const clearCompare = useAppStore((s) => s.clearCompare);
    const vehicles = useVehicleStore((s) => s.vehicles);
    const getVehicleById = useVehicleStore((s) => s.getVehicleById);

    const v1 = compareList[0] ? getVehicleById(compareList[0]) : null;
    const v2 = compareList[1] ? getVehicleById(compareList[1]) : null;

    /* ── Local filtering state ── */
    const [searchQuery, setSearchQuery] = useState('');
    const [fuelFilter, setFuelFilter] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');

    const filteredVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const matchesSearch = !searchQuery ||
                v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.model.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFuel = !fuelFilter || v.fuelType === fuelFilter;
            const matchesGrade = !gradeFilter || String(v.condition_grade) === gradeFilter;
            return matchesSearch && matchesFuel && matchesGrade;
        });
    }, [vehicles, searchQuery, fuelFilter, gradeFilter]);

    /* ── Empty state: let user pick ── */
    if (!v1 || !v2) {
        return (
            <Container size="lg" py="xl" style={{ marginTop: 80 }}>
                <Button variant="subtle" color="gray" leftSection={<ArrowLeft size={14} />}
                    onClick={() => navigate('/')} mb="lg">
                    Back to Gallery
                </Button>
                <Text ff="var(--font-display)" fz={36} c="white" mb={4}>Compare Vehicles</Text>
                <Text c="dimmed" mb="xl">Select two vehicles to compare side by side</Text>

                {/* Filters */}
                <Group mb="xl" style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <TextInput
                        placeholder="Search make or model..."
                        leftSection={<Search size={16} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.currentTarget.value)}
                        style={{ flex: 1, minWidth: 200 }}
                    />
                    <Select
                        placeholder="All Fuels"
                        data={[
                            { value: '', label: 'All Fuels' },
                            { value: 'Petrol', label: 'Petrol' },
                            { value: 'Diesel', label: 'Diesel' },
                            { value: 'Hybrid', label: 'Hybrid' },
                            { value: 'Full Electric', label: 'Electric' }
                        ]}
                        value={fuelFilter}
                        onChange={setFuelFilter}
                    />
                    <Select
                        placeholder="All Grades"
                        data={[
                            { value: '', label: 'All Grades' },
                            { value: '5', label: 'Grade 5 (Excellent)' },
                            { value: '4', label: 'Grade 4 (Good)' },
                            { value: '3', label: 'Grade 3 (Fair)' },
                        ]}
                        value={gradeFilter}
                        onChange={setGradeFilter}
                    />
                </Group>

                <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
                    {filteredVehicles.map((v) => {
                        const sel = compareList.includes(v.id);
                        return (
                            <Paper
                                key={v.id}
                                radius="lg" p="md"
                                style={{
                                    cursor: 'pointer',
                                    border: sel ? '1px solid rgba(0,200,117,0.5)' : '1px solid rgba(255,255,255,0.07)',
                                    background: sel ? 'rgba(0,200,117,0.06)' : '#1A1B1E',
                                    transition: 'all 0.2s',
                                }}
                                onClick={() => sel ? removeFromCompare(v.id) : addToCompare(v.id)}
                            >
                                <Box style={{ height: 70, overflow: 'hidden', borderRadius: 8, background: v.thumbnailColor, marginBottom: 10 }}>
                                    <img src={v.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.style.display = 'none'; }} />
                                </Box>
                                <Text fz={13} fw={700} c="white">{v.make} {v.model}</Text>
                                <Text fz={11} c="dimmed">{v.year} · Grade {v.condition_grade}</Text>
                                {sel && <Badge size="xs" color="brand" mt={4}>Selected</Badge>}
                            </Paper>
                        );
                    })}
                </SimpleGrid>
            </Container>
        );
    }

    /* ── Comparison rows ── */
    const rows = [
        { label: 'Year', key: 'year', fmt: (v) => v.year },
        { label: 'Age', key: 'age', fmt: (v) => `${v.age} years` },
        { label: 'Mileage', key: 'mileage', fmt: (v) => formatKm(v.mileage) },
        { label: 'Condition Grade', key: 'condition_grade', fmt: (v) => `${v.condition_grade}/5 — ${v.condition_label}` },
        { label: 'Market Value', key: null, fmt: (v) => formatLKR(v.market_value_lkr) },
        { label: 'Fuel Type', key: null, fmt: (v) => v.fuelType },
        { label: 'Transmission', key: null, fmt: (v) => v.transmission },
        { label: 'Drive Type', key: null, fmt: (v) => v.driveType },
        { label: 'Displacement', key: null, fmt: (v) => v.displacement },
        { label: 'Accidents', key: null, accidents: true },
    ];

    /* ── Depreciation data for Mantine chart ── */
    const allYears = [...new Set([
        ...v1.depreciation.map((d) => d.year),
        ...v2.depreciation.map((d) => d.year),
    ])].sort();

    const depChartData = allYears.map((year) => ({
        year: String(year),
        [v1.make + ' ' + v1.model]: v1.depreciation.find((d) => d.year === year)?.value || null,
        [v2.make + ' ' + v2.model]: v2.depreciation.find((d) => d.year === year)?.value || null,
    }));

    const badgeKeys = ['on_time_service', 'one_owner', 'no_accident', 'untampered_mileage'];
    const badgeLabels = { on_time_service: 'On-Time Service', one_owner: 'One Owner', no_accident: 'No Accidents', untampered_mileage: 'Mileage Verified' };

    return (
        <Container size="lg" py="xl" style={{ marginTop: 80 }}>
            {/* Header */}
            <Group justify="space-between" mb="xl">
                <Group>
                    <Button variant="subtle" color="gray" leftSection={<ArrowLeft size={14} />} onClick={() => navigate('/')}>
                        Back
                    </Button>
                    <Text ff="var(--font-display)" fz={32} c="white">Compare Vehicles</Text>
                </Group>
                <Button variant="outline" color="gray" size="sm" onClick={clearCompare}>Change Vehicles</Button>
            </Group>

            {/* Vehicle heroes */}
            <SimpleGrid cols={2} spacing="md" mb="xl">
                {[v1, v2].map((v) => (
                    <Paper key={v.id} radius="lg" p={0} style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <Box style={{ height: 160, background: v.thumbnailColor }}>
                            <img src={v.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display = 'none'; }} />
                        </Box>
                        <Stack gap={4} p="md">
                            <Text ff="var(--font-display)" fz={22} c="white">{v.make} {v.model}</Text>
                            <Text fz={12} c="dimmed">{v.variant} · {v.year}</Text>
                            <Button size="xs" variant="outline" color="brand" mt={4}
                                leftSection={<BookOpen size={12} />}
                                onClick={() => navigate(`/passport/${v.id}`)}>
                                View Passport
                            </Button>
                        </Stack>
                    </Paper>
                ))}
            </SimpleGrid>

            {/* Comparison table */}
            <Paper radius="lg" mb="xl" style={{ overflow: 'hidden' }}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{ width: '30%' }}>Spec</Table.Th>
                            <Table.Th>{v1.make} {v1.model}</Table.Th>
                            <Table.Th>{v2.make} {v2.model}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows.map((row, i) => {
                            const winner = row.key ? getWinner(row.key, v1, v2) : 'tie';
                            const acc1 = row.accidents ? getAccidentCount(v1) : null;
                            const acc2 = row.accidents ? getAccidentCount(v2) : null;
                            return (
                                <Table.Tr key={i}>
                                    <Table.Td><Text fz={12} c="dimmed" tt="uppercase" lts="0.05em">{row.label}</Text></Table.Td>
                                    <Table.Td>
                                        <Group gap={6}>
                                            {row.accidents
                                                ? acc1 === 0
                                                    ? <><CheckCircle2 size={14} color="#00C875" /><Text fz={13} c="green.4">Clean</Text></>
                                                    : <><XCircle size={14} color="#FF4545" /><Text fz={13} c="red.4">{acc1} Accident(s)</Text></>
                                                : <Text fz={13} fw={winner === 'left' ? 700 : 400} c={winner === 'left' ? 'brand.4' : 'white'}>{row.fmt(v1)}</Text>}
                                            {winner === 'left' && !row.accidents && <Check size={12} color="#00C875" />}
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap={6}>
                                            {row.accidents
                                                ? acc2 === 0
                                                    ? <><CheckCircle2 size={14} color="#00C875" /><Text fz={13} c="green.4">Clean</Text></>
                                                    : <><XCircle size={14} color="#FF4545" /><Text fz={13} c="red.4">{acc2} Accident(s)</Text></>
                                                : <Text fz={13} fw={winner === 'right' ? 700 : 400} c={winner === 'right' ? 'brand.4' : 'white'}>{row.fmt(v2)}</Text>}
                                            {winner === 'right' && !row.accidents && <Check size={12} color="#00C875" />}
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            );
                        })}
                    </Table.Tbody>
                </Table>
            </Paper>

            {/* Trust Badges */}
            <Text ff="var(--font-display)" fz={28} c="white" mb="md">Trust Badges</Text>
            <Paper radius="lg" p="md" mb="xl">
                <Stack gap="sm">
                    {badgeKeys.map((key) => (
                        <Group key={key} justify="space-between" py={6} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <Group gap={6}>
                                {v1.badges?.[key]
                                    ? <CheckCircle2 size={16} color="#00C875" />
                                    : <XCircle size={16} color="#FF4545" />}
                                <Text fz={13} c={v1.badges?.[key] ? 'green.4' : 'dimmed'}>{badgeLabels[key]}</Text>
                            </Group>
                            <Badge variant="dot" color="gray" size="sm">{badgeLabels[key]}</Badge>
                            <Group gap={6}>
                                <Text fz={13} c={v2.badges?.[key] ? 'green.4' : 'dimmed'}>{badgeLabels[key]}</Text>
                                {v2.badges?.[key]
                                    ? <CheckCircle2 size={16} color="#00C875" />
                                    : <XCircle size={16} color="#FF4545" />}
                            </Group>
                        </Group>
                    ))}
                </Stack>
            </Paper>

            {/* Depreciation Chart */}
            <Text ff="var(--font-display)" fz={28} c="white" mb="md">Depreciation Comparison</Text>
            <Paper radius="lg" p="xl" mb="xl">
                <LineChart
                    h={260}
                    data={depChartData}
                    dataKey="year"
                    series={[
                        { name: `${v1.make} ${v1.model}`, color: '#4A9EFF' },
                        { name: `${v2.make} ${v2.model}`, color: '#F5C842' },
                    ]}
                    curveType="monotone"
                    gridAxis="xy"
                    tooltipProps={{
                        content: ({ payload }) => payload?.[0] ? (
                            <Paper p="xs" radius="md" style={{ background: '#25262b', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {payload.map((p) => (
                                    <Text key={p.name} fz={12} c={p.color}>{p.name}: LKR {Number(p.value).toLocaleString()}</Text>
                                ))}
                            </Paper>
                        ) : null,
                    }}
                />
            </Paper>
        </Container>
    );
}
