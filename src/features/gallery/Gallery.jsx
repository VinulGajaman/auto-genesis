import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Group, Stack, Text, TextInput, Select, Button,
    SimpleGrid, Paper, Tooltip, Container,
} from '@mantine/core';
import {
    Search, Repeat2,
    Check, BookOpen, ArrowUpDown,
    Wrench, User, ShieldCheck, Gauge
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useVehicleStore } from '../../store/useVehicleStore';
import { GRADE_COLORS } from '../../data/phaseColors';
import { formatLKR, formatKm } from '../../utils/formatters';
import useCountUp from '../../hooks/useCountUp';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import '../../styles/Gallery.css';

export default function Gallery() {
    const [search, setSearch] = useState('');
    const [fuelFilter, setFuelFilter] = useState(null);
    const [gradeFilter, setGradeFilter] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const navigate = useNavigate();

    const compareList = useAppStore((s) => s.compareList);
    const addToCompare = useAppStore((s) => s.addToCompare);
    const removeFromCompare = useAppStore((s) => s.removeFromCompare);
    const allVehicles = useVehicleStore((s) => s.vehicles);

    const filtered = useMemo(() => {
        let results = allVehicles.filter((v) => {
            const q = search.toLowerCase();
            const matchQ = !q || `${v.make} ${v.model} ${v.variant}`.toLowerCase().includes(q);
            const matchFuel = !fuelFilter || v.fuelType.toLowerCase().includes(fuelFilter.toLowerCase());
            const matchGrade = !gradeFilter || v.condition_grade === Number(gradeFilter);
            return matchQ && matchFuel && matchGrade;
        });
        if (sortBy === 'price_asc') results.sort((a, b) => a.market_value_lkr - b.market_value_lkr);
        if (sortBy === 'price_desc') results.sort((a, b) => b.market_value_lkr - a.market_value_lkr);
        if (sortBy === 'year_desc') results.sort((a, b) => b.year - a.year);
        if (sortBy === 'year_asc') results.sort((a, b) => a.year - b.year);
        if (sortBy === 'grade_desc') results.sort((a, b) => b.condition_grade - a.condition_grade);
        return results;
    }, [search, fuelFilter, gradeFilter, sortBy, allVehicles]);

    const handleCompareToggle = (id) => {
        if (compareList.includes(id)) removeFromCompare(id);
        else addToCompare(id);
    };

    return (
        <div className="page" id="page-gallery">
            {/* ── Hero ── */}
            <section className="gallery-hero" style={{ position: 'relative', overflow: 'hidden' }}>
                <video
                    src="/bgvideo.mp4"
                    autoPlay loop muted playsInline
                    style={{
                        position: 'absolute',
                        top: '50%', left: '50%', width: '100%', height: '100%',
                        objectFit: 'cover', transform: 'translate(-50%, -50%)',
                        zIndex: 0, opacity: 0.35, pointerEvents: 'none'
                    }}
                />
                <div className="hero-grid-bg" style={{ zIndex: 1 }} />
                <div className="hero-glow-orb hero-orb-1" style={{ zIndex: 1 }} />
                <div className="hero-glow-orb hero-orb-2" style={{ zIndex: 1 }} />
                <motion.div
                    className="hero-content"
                    style={{ zIndex: 2 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="hero-title">
                        Transparent Vehicle<br />
                        <span className="hero-title-accent">History &amp; Trust</span>
                    </h1>
                    <Box className="hero-description" visibleFrom="sm">
                        Every vehicle tells a story. AutoGenesis Passport verifies, documents,
                        and presents the complete lifecycle — from factory floor to your driveway.
                    </Box>
                    <Group gap="sm" mt="lg">
                        <Button
                            size="md" color="brand" radius="xl" fw={700}
                            onClick={() => document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Explore Fleet
                        </Button>
                        <Button
                            size="md" variant="outline" color="gray" radius="xl" fw={600}
                            onClick={() => navigate('/compare')}
                        >
                            Compare Vehicles
                        </Button>
                    </Group>
                </motion.div>
            </section>

            {/* ── Stats bar ── */}
            <HeroStats />

            {/* ── Fleet Section ── */}
            <section id="fleet-section" className="fleet-section">
                <Container size="xl">
                    <Stack gap={0} mb="lg">
                        <Text ff="var(--font-display)" fz={42} lts="0.04em" c="white">Explore Our Fleet</Text>
                        <Text fz={16} c="rgba(255,255,255,0.7)">Each vehicle comes with a verified digital passport</Text>
                    </Stack>
                </Container>

                {/* ── Filter Controls (all Mantine) ── */}
                <Container size="xl">
                    <Group gap="sm" mb="xl" wrap="wrap" align="flex-end">
                        <TextInput
                            placeholder="Search make, model, variant..."
                            leftSection={<Search size={15} />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ flex: 1, minWidth: 220 }}
                            radius="md"
                            styles={{ input: { height: 40 } }}
                        />
                        <Select
                            placeholder="All Fuel Types"
                            data={[
                                { value: 'hybrid', label: 'Hybrid' },
                                { value: 'electric', label: 'Electric' },
                                { value: 'plug-in', label: 'Plug-in Hybrid' },
                                { value: 'petrol', label: 'Petrol' },
                                { value: 'diesel', label: 'Diesel' },
                            ]}
                            value={fuelFilter}
                            onChange={setFuelFilter}
                            clearable
                            radius="md"
                            w={160}
                        />
                        <Select
                            placeholder="All Grades"
                            data={[
                                { value: '5', label: 'Grade 5 — Excellent' },
                                { value: '4', label: 'Grade 4 — Good' },
                                { value: '3', label: 'Grade 3 — Fair' },
                                { value: '2', label: 'Grade 2 — Below Avg' },
                                { value: '1', label: 'Grade 1 — Poor' },
                            ]}
                            value={gradeFilter}
                            onChange={setGradeFilter}
                            clearable
                            radius="md"
                            w={180}
                        />
                        <Select
                            placeholder="Sort by"
                            leftSection={<ArrowUpDown size={13} />}
                            data={[
                                { value: 'year_desc', label: 'Newest First' },
                                { value: 'year_asc', label: 'Oldest First' },
                                { value: 'price_asc', label: 'Lowest Price' },
                                { value: 'price_desc', label: 'Highest Price' },
                                { value: 'grade_desc', label: 'Best Grade' },
                            ]}
                            value={sortBy}
                            onChange={setSortBy}
                            clearable
                            radius="md"
                            w={160}
                        />
                        <Text fz={13} c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                            {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''}
                        </Text>
                    </Group>
                </Container>

                {/* ── Vehicle Grid ── */}
                <Container size="xl">
                    {filtered.length === 0 ? (
                        <Paper p="xl" ta="center" radius="lg" style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <Text fz={16} fw={600} c="white" mb={4}>No Vehicles Found</Text>
                            <Text fz={13} c="dimmed">Try adjusting your search or filters</Text>
                        </Paper>
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing="lg">
                                {filtered.map((v, i) => (
                                    <motion.div
                                        key={v.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                                        }}
                                    >
                                        <VehicleCard
                                            vehicle={v}
                                            index={i}
                                            isComparing={compareList.includes(v.id)}
                                            onCompareToggle={handleCompareToggle}
                                            onViewPassport={() => navigate(`/passport/${v.id}`)}
                                            onSwap={() => navigate(`/swap/${v.id}`)}
                                        />
                                    </motion.div>
                                ))}
                            </SimpleGrid>
                        </motion.div>
                    )}
                </Container>
            </section>
        </div>
    );
}

/* ── Hero Stats ── */
function HeroStats() {
    const [ref, isVisible] = useIntersectionObserver();
    const vehicles = useCountUp(5, 800, (n) => n, isVisible);
    const records = useCountUp(47, 1200, (n) => n, isVisible);
    const trust = useCountUp(3200, 1600, (n) => n.toLocaleString(), isVisible);

    return (
        <div className="hero-stats" ref={ref}>
            <div className="hero-stat">
                <span className="hero-stat-number">{vehicles}</span>
                <span className="hero-stat-label">Certified Vehicles</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
                <span className="hero-stat-number">{records}</span>
                <span className="hero-stat-label">Verified Records</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
                <span className="hero-stat-number">{trust}+</span>
                <span className="hero-stat-label">Trusted Owners</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
                <span className="hero-stat-number">100%</span>
                <span className="hero-stat-label">Verified Sources</span>
            </div>
        </div>
    );
}

/* ── Vehicle Card ── */
function VehicleCard({ vehicle: v, index, isComparing, onCompareToggle, onViewPassport, onSwap }) {
    const [imgRef, isVisible] = useIntersectionObserver();
    const gradeColor = GRADE_COLORS[v.condition_grade] || '#999';
    const badgeKeys = ['on_time_service', 'one_owner', 'no_accident', 'untampered_mileage'];
    const earnedCount = badgeKeys.filter((k) => v.badges?.[k]).length;

    return (
        <Paper
            ref={imgRef}
            radius="lg"
            className={`vehicle-card ${isComparing ? 'selected' : ''} ${isVisible ? 'visible' : ''}`}
            style={{
                transitionDelay: `${index * 60}ms`,
                overflow: 'hidden',
                background: 'rgba(17,24,39,0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: isComparing ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.07)',
            }}
        >
            {/* Image */}
            <Box
                className="card-image-wrap"
                style={{ backgroundColor: v.thumbnailColor, position: 'relative' }}
            >
                <img
                    src={v.image} alt={`${v.make} ${v.model}`} loading="lazy"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                {/* Grade badge */}
                <Box
                    style={{
                        position: 'absolute', top: 10, right: 10,
                        background: gradeColor, color: v.condition_grade <= 1 ? '#fff' : '#000',
                        padding: '2px 9px', borderRadius: 99,
                        fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-body)',
                    }}
                >
                    {v.condition_grade}★
                </Box>
                {/* Compare check */}
                <Tooltip
                    label={isComparing ? 'Remove from compare' : 'Add to compare'}
                    position="top"
                    withArrow
                >
                    <Box
                        className={`card-compare-check ${isComparing ? 'checked' : ''}`}
                        onClick={(e) => { e.stopPropagation(); onCompareToggle(v.id); }}
                        role="checkbox"
                        aria-checked={isComparing}
                        aria-label={`Compare ${v.make} ${v.model}`}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onCompareToggle(v.id)}
                    >
                        {isComparing && <Check size={12} strokeWidth={3} />}
                    </Box>
                </Tooltip>
            </Box>

            {/* Body */}
            <Stack gap={10} p="md">
                <Box>
                    <Text ff="var(--font-display)" fz={20} lts="0.03em" c="white" lh={1.1}>
                        {v.make} {v.model}
                    </Text>
                    <Text fz={12} c="dimmed" mt={2}>{v.variant} · {v.year}</Text>
                </Box>

                {/* Stats row */}
                <Group gap={0} grow style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                    {[
                        { label: 'Age', value: `${v.age}y` },
                        { label: 'Mileage', value: formatKm(v.mileage) },
                        { label: 'Grade', value: `${v.condition_grade}/5`, color: gradeColor },
                    ].map((s) => (
                        <Box key={s.label} ta="center">
                            <Text fz={13} fw={700} c={s.color || 'white'}>{s.value}</Text>
                            <Text fz={10} c="dimmed" tt="uppercase" lts="0.05em">{s.label}</Text>
                        </Box>
                    ))}
                </Group>

                {/* Price */}
                <Text fw={700} fz={16} c="brand.4">{formatLKR(v.market_value_lkr)}</Text>

                {/* Trust Badges - explicit icons */}
                <Group gap={6}>
                    {v.badges?.on_time_service && (
                        <Tooltip label="On-Time Service" withArrow position="top">
                            <Box style={{ color: '#3b82f6' }}><Wrench size={14} /></Box>
                        </Tooltip>
                    )}
                    {v.badges?.one_owner && (
                        <Tooltip label="One Owner" withArrow position="top">
                            <Box style={{ color: '#3b82f6' }}><User size={14} /></Box>
                        </Tooltip>
                    )}
                    {v.badges?.no_accident && (
                        <Tooltip label="No Accident" withArrow position="top">
                            <Box style={{ color: '#3b82f6' }}><ShieldCheck size={14} /></Box>
                        </Tooltip>
                    )}
                    {v.badges?.untampered_mileage && (
                        <Tooltip label="Mileage Verified" withArrow position="top">
                            <Box style={{ color: '#3b82f6' }}><Gauge size={14} /></Box>
                        </Tooltip>
                    )}
                    <Text fz={10} c="dimmed" ml="auto">{earnedCount}/4 verified</Text>
                </Group>

                {/* Actions */}
                <Group gap="xs" grow>
                    <Button
                        size="xs" color="brand" radius="md" fw={700}
                        onClick={onViewPassport}
                        leftSection={<BookOpen size={13} />}
                    >
                        View Passport
                    </Button>
                    <Button
                        size="xs" variant="outline" color="gray" radius="md" fw={600}
                        onClick={onSwap}
                        leftSection={<Repeat2 size={13} />}
                    >
                        Swap
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
}
