import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Group, Stack, Text, Button, Paper, SimpleGrid, Grid,
  Badge, Tabs, Tooltip, ActionIcon,
  Select,
} from '@mantine/core';
import {
  ArrowLeft, GitCompare, ArrowLeftRight, Link2, Download, Check,
  Wrench, User, ShieldCheck, Gauge, AlertTriangle, CheckCircle2, XCircle,
  MapPin, Ship, Building2, Flag, Calendar, Milestone, ChevronDown,
  Activity, Clock, Zap, TrendingDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip as ChartTooltip, Filler,
} from 'chart.js';
import { useAppStore } from '../store/useAppStore';
import { PHASE_COLORS, TAB_FILTERS } from '../data/phaseColors';
import {
  getVehicleById, formatLKR, formatKm, formatDate,
  calcDepreciationStats, getPlateNumber, getAccidentCount,
} from '../utils/helpers';
import '../styles/Passport.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Filler);

/* ─── Grade color map ───────────────────────────────── */
const GRADE_COLORS = {
  1: '#f87171', 2: '#fb923c', 3: '#fbbf24', 4: '#3b82f6', 5: '#22d3ee',
};
const GRADE_LABELS = {
  1: 'Poor', 2: 'Below Avg', 3: 'Fair', 4: 'Good', 5: 'Excellent',
};

export default function Passport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = getVehicleById(id);
  const addToCompare = useAppStore((s) => s.addToCompare);
  const showToast = useAppStore((s) => s.showToast);
  const [activeTab, setActiveTab] = useState('timeline');

  React.useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!vehicle) return (
    <Container py="xl" ta="center">
      <Text ff="var(--font-display)" fz={28} c="white" mb="md">Vehicle not found</Text>
      <Button color="brand" onClick={() => navigate('/')}>Back to Gallery</Button>
    </Container>
  );

  const plate = getPlateNumber(vehicle);
  const accidentCount = getAccidentCount(vehicle);
  const depStats = calcDepreciationStats(vehicle);
  const gradeColor = GRADE_COLORS[vehicle.condition_grade] || '#3b82f6';

  return (
    <Box style={{ minHeight: '100vh', background: '#080c12' }}>

      {/* ════ HERO ════ */}
      <Box
        className="passport-hero"
        style={{
          position: 'relative',
          paddingTop: 80,
          paddingBottom: 40,
          background: 'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.15), transparent 60%)',
        }}
      >
        <Container size="xl">
          <Button
            variant="subtle" color="gray" size="sm"
            leftSection={<ArrowLeft size={14} />}
            onClick={() => navigate('/')}
            mb="xl"
          >
            Back
          </Button>

          <Grid gutter={{ base: 60, md: 50 }} align="center">
            {/* ── Left: Creative Image Composition ── */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ position: 'relative' }}
              >
                <Box
                  style={{
                    borderRadius: 24,
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px ${vehicle.thumbnailColor || 'rgba(255,255,255,0.1)'}`,
                    aspectRatio: '16/10',
                    backgroundColor: vehicle.thumbnailColor || '#1a1f2e',
                  }}
                >
                  {/* Embedded Verified Badge (Top Right) */}
                  <Box
                    style={{
                      position: 'absolute', top: 16, right: 16, zIndex: 10,
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      padding: '6px 14px', borderRadius: 999,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    }}
                  >
                    <Box
                      style={{
                        width: 16, height: 16, borderRadius: '50%', background: '#3b82f6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Check size={10} strokeWidth={4} color="#080c12" />
                    </Box>
                    <Text ff="var(--font-display)" fz={11} fw={700} lts="0.08em" style={{ color: '#fff', lineHeight: 1 }}>
                      AUTOGENESIS <span style={{ color: '#60a5fa' }}>VERIFIED</span>
                    </Text>
                  </Box>

                  <Box style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
                  {vehicle.image && (
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                </Box>

                {/* Overlapping Glass Stats Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  style={{
                    position: 'absolute',
                    bottom: -20,
                    left: '10%',
                    right: '10%',
                    background: 'rgba(17, 24, 39, 0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 16,
                    padding: '12px 20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 2,
                  }}
                >
                  <Box>
                    <Text fz={10} c="dimmed" tt="uppercase" fw={600} lts="0.1em">VIN / Chassis</Text>
                    <Text fz={13} fw={500} c="white" style={{ fontFamily: 'monospace' }}>{vehicle.vin}</Text>
                  </Box>
                  {plate && (
                    <Box style={{ textAlign: 'right' }}>
                      <Text fz={10} c="dimmed" tt="uppercase" fw={600} lts="0.1em">Plate Number</Text>
                      <Badge variant="filled" size="sm" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                        {plate}
                      </Badge>
                    </Box>
                  )}
                </motion.div>
              </motion.div>
            </Grid.Col>

            {/* ── Right: Typography & Details ── */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Text
                    ff="var(--font-display)"
                    fz={{ base: 46, sm: 64, md: 80 }}
                    lts="0.02em"
                    c="white"
                    lh={1}
                  >
                    {vehicle.make.toUpperCase()}{' '}
                    <span style={{ color: '#60a5fa' }}>{vehicle.model.toUpperCase()}</span>
                  </Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Text c="rgba(255,255,255,0.7)" fz={20} fw={500}>
                    {vehicle.variant} · {vehicle.year} · {vehicle.color}
                  </Text>
                </motion.div>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* ════ QUICK STATS STRIP ════ */}
      <Box style={{ background: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Container size="xl">
          <SimpleGrid cols={{ base: 2, sm: 4 }} py="xl">
            <StatBlock label="Age" value={`${vehicle.age}y`} sub={`${vehicle.year} Model`} />
            <StatBlock label="Mileage" value={formatKm(vehicle.mileage)} sub="Odometer" />
            <StatBlock
              label="Grade"
              value={`${vehicle.condition_grade}/5`}
              sub={GRADE_LABELS[vehicle.condition_grade]}
              valueColor={gradeColor}
            />
            <StatBlock label="Market Value" value={formatLKR(vehicle.market_value_lkr)} sub="Current Estimate" />
          </SimpleGrid>
        </Container>
      </Box>

      {/* ════ MAIN CONTENT ════ */}
      <Container size="xl" py="xl">

        {/* ── Grade Ring + Badges ── */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb="xl">
          {/* Grade */}
          <Paper radius="xl" p="xl" style={{ textAlign: 'center', background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Text fz={11} c="dimmed" tt="uppercase" lts="0.1em" mb="md" fw={600}>Condition Grade</Text>
            <Box style={{ position: 'relative', width: 150, height: 150, margin: '0 auto' }}>
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle
                  cx="75" cy="75" r="62"
                  fill="none"
                  stroke={gradeColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(vehicle.condition_grade / 5) * 389} 389`}
                  transform="rotate(-90 75 75)"
                  style={{ filter: `drop-shadow(0 0 8px ${gradeColor}66)`, transition: 'stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)' }}
                />
              </svg>
              <Box style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Text ff="var(--font-display)" fz={56} lh={1} style={{ color: gradeColor }}>{vehicle.condition_grade}</Text>
                <Text fz={12} c="dimmed">out of 5</Text>
              </Box>
            </Box>
            <Text fz={18} fw={700} c="white" mt="md">{GRADE_LABELS[vehicle.condition_grade]}</Text>
            <Text fz={12} c="dimmed" mt={4}>{vehicle.condition_label}</Text>
          </Paper>

          {/* Trust badges */}
          <Paper radius="xl" p="xl" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Text fz={11} c="dimmed" tt="uppercase" lts="0.1em" mb="md" fw={600}>Trust Badges</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {[
                { key: 'on_time_service', label: 'On-Time Service', desc: 'All services done on schedule', icon: <Wrench size={22} /> },
                { key: 'one_owner', label: 'One Owner', desc: 'Single ownership history', icon: <User size={22} /> },
                { key: 'no_accident', label: 'No Accident', desc: 'No recorded accidents', icon: <ShieldCheck size={22} /> },
                { key: 'untampered_mileage', label: 'Mileage Verified', desc: 'Odometer not tampered', icon: <Gauge size={22} /> },
              ].map(({ key, label, desc, icon }) => {
                const earned = vehicle.badges?.[key];
                return (
                  <Paper
                    key={key} radius="xl" p="md"
                    style={{
                      border: earned ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      background: earned ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
                      opacity: earned ? 1 : 0.45,
                      position: 'relative',
                    }}
                  >
                    <Group gap="sm" align="center" wrap="nowrap">
                      <Box style={{ color: earned ? '#3b82f6' : 'var(--text-muted)' }}>{icon}</Box>
                      <Box style={{ minWidth: 0 }}>
                        <Text fz={15} fw={700} c={earned ? 'white' : 'dimmed'}>{label}</Text>
                        <Text fz={13} c="dimmed" lh={1.4}>{desc}</Text>
                      </Box>
                    </Group>
                    <Box style={{ position: 'absolute', top: 16, right: 16 }}>
                      {earned
                        ? <CheckCircle2 size={18} color="#3b82f6" />
                        : <XCircle size={18} color="#64748b" />}
                    </Box>
                  </Paper>
                );
              })}
            </SimpleGrid>
          </Paper>
        </SimpleGrid>

        {/* ── Specs Table ── */}
        <Paper radius="xl" p="xl" mb="xl" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)' }}>
          <Text fz={11} c="dimmed" tt="uppercase" lts="0.1em" mb="lg" fw={600}>Vehicle Specifications</Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={0} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              ['Make', vehicle.make],
              ['Model', vehicle.model],
              ['Variant', vehicle.variant],
              ['Year', vehicle.year],
              ['Fuel Type', vehicle.fuelType],
              ['Transmission', vehicle.transmission],
              ['Body Type', vehicle.bodyType],
              ['Drive Type', vehicle.driveType],
              ['Engine', vehicle.displacement],
              ['Doors', vehicle.doors],
              ['Seats', vehicle.seats],
              ['Color', vehicle.color],
              ['VIN', vehicle.vin],
              ['Engine No.', vehicle.engineNo],
              ['Country of Origin', 'Japan'],
            ].filter(([, v]) => v !== undefined && v !== null && v !== '').map(([label, value], i) => (
              <Box
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <Text fz={13} c="dimmed">{label}</Text>
                <Text fz={13} fw={500} c="white" style={{ textAlign: 'right' }}>{value}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Paper>

        {/* ── Tabbed History ── */}
        <Paper radius="xl" mb="xl" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <Tabs value={activeTab} onChange={setActiveTab} color="brand" keepMounted={false}>
            {/* Custom Animated Tab List */}
            <Box
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: 'rgba(255,255,255,0.01)',
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {[
                { id: 'timeline', label: 'Full Timeline', icon: <Activity size={14} /> },
                { id: 'service', label: 'Service', icon: <Wrench size={14} /> },
                { id: 'ownership', label: 'Ownership', icon: <User size={14} /> },
                { id: 'travel', label: 'Travel', icon: <Ship size={14} /> },
                { id: 'accident', label: 'Accident', icon: <AlertTriangle size={14} />, badge: accidentCount > 0 ? accidentCount : null },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <Box
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      position: 'relative',
                      padding: '8px 16px',
                      borderRadius: 999,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      whiteSpace: 'nowrap',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                      transition: 'color 0.2s',
                      zIndex: 1,
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPassport"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: '#3b82f6',
                          borderRadius: 999,
                          zIndex: -1,
                          boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                        }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Box style={{ opacity: isActive ? 1 : 0.7 }}>{tab.icon}</Box>
                    <Text fz={14} lh={1}>{tab.label}</Text>
                    {tab.badge && (
                      <Badge size="xs" color={isActive ? 'white' : 'red'} variant={isActive ? 'filled' : 'light'} circle style={{ color: isActive ? '#000' : undefined }}>
                        {tab.badge}
                      </Badge>
                    )}
                  </Box>
                );
              })}
            </Box>

            <Box p="xl" style={{ position: 'relative' }}>
              <Tabs.Panel value="timeline"><TabContent vehicle={vehicle} tabName="timeline" /></Tabs.Panel>
              <Tabs.Panel value="service"><TabContent vehicle={vehicle} tabName="service" /></Tabs.Panel>
              <Tabs.Panel value="ownership"><TabContent vehicle={vehicle} tabName="ownership" /></Tabs.Panel>
              <Tabs.Panel value="travel"><TabContent vehicle={vehicle} tabName="travel" /></Tabs.Panel>
              <Tabs.Panel value="accident"><TabContent vehicle={vehicle} tabName="accident" /></Tabs.Panel>
            </Box>
          </Tabs>
        </Paper>

        {/* ── Depreciation Chart ── */}
        <Paper radius="xl" p="xl" mb="xl" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)' }}>
          <Group justify="space-between" mb="xl" wrap="wrap" gap="md">
            <Box>
              <Text fz={11} c="dimmed" tt="uppercase" lts="0.1em" mb={4} fw={600}>Depreciation History</Text>
              <Text ff="var(--font-display)" fz={32} c="white" lts="0.03em">Market Value Over Time</Text>
            </Box>
            <Text ff="var(--font-display)" fz={28} style={{ color: '#60a5fa' }}>{formatLKR(vehicle.market_value_lkr)}</Text>
          </Group>

          <Box style={{ height: 240 }}>
            <DepreciationChart vehicle={vehicle} />
          </Box>

          <SimpleGrid cols={{ base: 1, sm: 3 }} mt="xl" spacing="md">
            {[
              { label: 'Initial Value', value: formatLKR(depStats.initial), icon: <Zap size={14} />, color: '#3b82f6' },
              { label: 'Total Depreciation', value: `−${formatLKR(depStats.totalLoss)} (${depStats.totalPercent}%)`, icon: <TrendingDown size={14} />, color: '#f87171' },
              { label: 'Annual Average Loss', value: formatLKR(depStats.annualAvg), icon: <Clock size={14} />, color: '#fbbf24' },
            ].map(({ label, value, icon, color }) => (
              <Paper key={label} radius="lg" p="md" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Group gap={8} mb={6}>
                  <Box style={{ color }}>{icon}</Box>
                  <Text fz={11} c="dimmed" tt="uppercase" lts="0.07em" fw={600}>{label}</Text>
                </Group>
                <Text ff="var(--font-display)" fz={22} c="white">{value}</Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Paper>

        {/* ── Action Bar ── */}
        <Group gap="sm" pb="xl" wrap="wrap">
          <Button
            color="brand" size="md" radius="lg" fw={700}
            leftSection={<GitCompare size={15} />}
            onClick={() => { addToCompare(vehicle.id); showToast(`${vehicle.make} ${vehicle.model} added to compare!`, 'success'); }}
          >
            Add to Compare
          </Button>
          <Button
            radius="lg" size="md" fw={600}
            variant="filled"
            style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#000' }}
            leftSection={<ArrowLeftRight size={15} />}
            onClick={() => navigate(`/swap/${vehicle.id}`)}
          >
            Swap This Vehicle
          </Button>
          <Button
            variant="outline" color="gray" radius="lg" size="md" fw={600}
            leftSection={<Link2 size={15} />}
            onClick={() => { navigator.clipboard?.writeText(`https://autogenesis.lk/passport/${vehicle.id}`); showToast('Passport URL copied!', 'success'); }}
          >
            Share Passport
          </Button>
          <Tooltip label="Coming soon" color="dark">
            <Button
              variant="outline" color="gray" radius="lg" size="md" fw={600}
              style={{ opacity: 0.5 }}
              leftSection={<Download size={15} />}
            >
              Download PDF
            </Button>
          </Tooltip>
        </Group>
      </Container>
    </Box>
  );
}

/* ─── Sub-components ────────────────────────────── */

function StatBlock({ label, value, sub, valueColor = 'white' }) {
  return (
    <Box ta="center" py="md">
      <Text ff="var(--font-display)" fz={{ base: 28, sm: 36 }} lts="0.03em" style={{ color: valueColor }}>{value}</Text>
      <Text fz={11} c="dimmed" tt="uppercase" lts="0.08em" mt={2} fw={600}>{label}</Text>
      {sub && <Text fz={12} c="dimmed" mt={4}>{sub}</Text>}
    </Box>
  );
}

function DepreciationChart({ vehicle }) {
  const dep = vehicle.depreciation || [];
  const data = {
    labels: dep.map((d) => d.year),
    datasets: [{
      data: dep.map((d) => d.value),
      borderColor: '#3b82f6',
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 240);
        g.addColorStop(0, 'rgba(59,130,246,0.22)');
        g.addColorStop(1, 'rgba(59,130,246,0)');
        return g;
      },
      tension: 0.4, fill: true, borderWidth: 2,
      pointRadius: 4, pointBackgroundColor: '#3b82f6',
      pointHoverRadius: 6, pointHoverBackgroundColor: '#60a5fa',
    }],
  };
  const opts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ${formatLKR(c.raw)}` } } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 }, callback: (v) => `LKR ${(v / 1000000).toFixed(1)}M` } },
    },
  };
  return <Line data={data} options={opts} />;
}

function TabContent({ vehicle, tabName }) {
  const tabFilterFn = TAB_FILTERS[tabName] || (() => true);
  const tabFilteredEvents = vehicle.timeline.filter(tabFilterFn);

  const [activePhase, setActivePhase] = useState('all');
  const phases = ['all', ...new Set(tabFilteredEvents.map((e) => e.phase))];

  const finalFiltered = activePhase === 'all'
    ? tabFilteredEvents
    : tabFilteredEvents.filter((e) => e.phase === activePhase);

  if (tabFilteredEvents.length === 0) {
    return (
      <Box ta="center" py="xl" style={{ animation: 'tabSlideIn 0.3s ease' }}>
        <AlertTriangle size={32} color="#64748b" style={{ opacity: 0.5, marginBottom: 12 }} />
        <Text fz={15} c="dimmed">No {tabName} records found for this vehicle.</Text>
      </Box>
    );
  }

  // Map phases to Select data for mobile
  const selectData = phases.map(p => ({
    value: p,
    label: p === 'all' ? 'All Events' : (PHASE_COLORS[p]?.label || p)
  }));

  return (
    <Box py={0} style={{ animation: 'tabSlideIn 0.3s ease' }}>
      {/* Responsive Phase Filters */}
      {phases.length > 2 && (
        <Box mb="xl">
          {/* Desktop Pills */}
          <Group
            gap="xs"
            wrap="nowrap"
            visibleFrom="sm"
            style={{
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: 4
            }}
          >
            {phases.map((p) => {
              const pc = PHASE_COLORS[p] || {};
              return (
                <Button
                  key={p}
                  size="xs" radius="xl"
                  variant={activePhase === p ? 'filled' : 'outline'}
                  color={activePhase === p ? 'brand' : 'gray'}
                  onClick={() => setActivePhase(p)}
                  style={{ textTransform: 'capitalize', fontWeight: 600 }}
                >
                  {p === 'all' ? 'All Events' : (pc.label || p)}
                </Button>
              );
            })}
          </Group>

          {/* Mobile Select */}
          <Select
            hiddenFrom="sm"
            data={selectData}
            value={activePhase}
            onChange={setActivePhase}
            allowDeselect={false}
            size="md"
            radius="md"
            leftSection={<Activity size={16} />}
            styles={{ input: { backgroundColor: 'rgba(255,255,255,0.03)' } }}
          />
        </Box>
      )}

      {/* Timeline */}
      <Box style={{ position: 'relative', paddingLeft: 28 }}>
        {/* Vertical line */}
        <Box style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }} />

        <Stack gap="md">
          {finalFiltered.map((event, idx) => (
            <TimelineNode key={`${event.title}-${idx}`} event={event} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

function TimelineNode({ event }) {
  const [expanded, setExpanded] = useState(false);
  const pc = PHASE_COLORS[event.phase] || { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: event.phase };
  const isAccident = event.phase === 'accident';

  return (
    <Box style={{ position: 'relative', animation: 'tabSlideIn 0.3s ease both' }}>
      {/* Dot on the line */}
      <Box style={{
        position: 'absolute', left: -21, top: 16,
        width: 14, height: 14, borderRadius: '50%',
        background: pc.color, border: `2px solid #080c12`,
        boxShadow: `0 0 8px ${pc.color}66`,
        zIndex: 2,
      }} />

      <Paper
        radius="lg" p={0}
        style={{
          border: isAccident ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(255,255,255,0.07)',
          background: isAccident ? 'rgba(248,113,113,0.05)' : 'rgba(255,255,255,0.02)',
          overflow: 'hidden',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Card header */}
        <Box
          style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setExpanded((e) => !e)}
        >
          <Group justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
              {/* Phase icon box */}
              <Box style={{
                width: 34, height: 34, borderRadius: 8, background: pc.bg, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PhaseIcon phase={event.phase} size={15} color={pc.color} />
              </Box>

              <Box style={{ minWidth: 0 }}>
                <Group gap={6} mb={2} wrap="wrap">
                  <Text fz={14} fw={600} c="white" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {event.title}
                  </Text>
                  {event.verified && (
                    <Badge size="xs" color="brand" variant="light" style={{ flexShrink: 0 }}>✓ Verified</Badge>
                  )}
                  {isAccident && event.severity && (
                    <Badge size="xs" color="red" variant="light">{event.severity}</Badge>
                  )}
                </Group>
                <Group gap={12} wrap="wrap">
                  <Text fz={12} c="dimmed">{event.source}</Text>
                  {event.date && (
                    <Group gap={4}>
                      <Calendar size={11} color="#64748b" />
                      <Text fz={11} c="dimmed">{formatDate(event.date)}</Text>
                    </Group>
                  )}
                  {event.mileage && (
                    <Group gap={4}>
                      <Milestone size={11} color="#64748b" />
                      <Text fz={11} c="dimmed">{formatKm(event.mileage)}</Text>
                    </Group>
                  )}
                </Group>
              </Box>
            </Group>

            <ActionIcon variant="subtle" color="gray" size="sm" style={{ flexShrink: 0 }}>
              <ChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }} />
            </ActionIcon>
          </Group>
        </Box>

        {/* Expandable detail */}
        {expanded && (
          <Box style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Text fz={13} c="rgba(255,255,255,0.65)" lh={1.7} mt="sm">{event.detail}</Text>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

function PhaseIcon({ phase, size = 15, color = '#3b82f6' }) {
  const icons = {
    manufacture: <Building2 size={size} color={color} />,
    ownership: <User size={size} color={color} />,
    service: <Wrench size={size} color={color} />,
    accident: <AlertTriangle size={size} color={color} />,
    registration: <Flag size={size} color={color} />,
    shipping: <Ship size={size} color={color} />,
    auction: <Activity size={size} color={color} />,
    inspection: <ShieldCheck size={size} color={color} />,
    export: <MapPin size={size} color={color} />,
    import: <MapPin size={size} color={color} />,
  };
  return icons[phase] || <Zap size={size} color={color} />;
}
