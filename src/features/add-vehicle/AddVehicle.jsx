import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, zodResolver } from '@mantine/form';
import {
    Container, Stepper, Button, Group, Stack, Text, Box,
    TextInput, NumberInput, Select, Textarea, Switch, Paper,
    ColorInput, FileInput, SimpleGrid, ActionIcon, Badge,
    Divider, Alert,
} from '@mantine/core';
import {
    ChevronRight, ChevronLeft, Plus, Minus, Send,
    Car, Cpu, Activity, Award, Clock, BookOpen, AlertCircle,
} from 'lucide-react';
import { step1Schema, step2Schema, step3Schema, step4Schema } from './schema/validation';
import { useVehicleStore } from '../../store/useVehicleStore';
import { useAppStore } from '../../store/useAppStore';
import { saveVehicle, saveVehicleImage } from '../../utils/vehicleStorage';
import { PHASE_COLORS } from '../../data/phaseColors';
import '../../styles/AddVehicle.css';

const STEPS = [
    { label: 'Basic Info', icon: <Car size={14} /> },
    { label: 'Tech Specs', icon: <Cpu size={14} /> },
    { label: 'Condition', icon: <Activity size={14} /> },
    { label: 'Badges', icon: <Award size={14} /> },
    { label: 'Timeline', icon: <Clock size={14} /> },
    { label: 'Review', icon: <BookOpen size={14} /> },
];

function defaultTimeline() {
    return [{
        id: Date.now(),
        phase: 'manufacture', source: '', date: '', title: '', detail: '', verified: false,
    }];
}

export default function AddVehicle() {
    const navigate = useNavigate();
    const showToast = useAppStore((s) => s.showToast);
    const refreshVehicles = useVehicleStore((s) => s.refreshCustomVehicles);

    const [active, setActive] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [timeline, setTimeline] = useState(defaultTimeline());
    const [submitting, setSubmitting] = useState(false);

    /* ── Mantine form with Zod resolver — per-step validation ── */
    const form = useForm({
        mode: 'controlled',
        initialValues: {
            // Step 1
            make: '', model: '', variant: '', year: new Date().getFullYear(),
            colorName: '', colorHex: '#888888',
            // Step 2
            vin: '', engineNo: '', fuelType: '', displacement: '',
            transmission: '', driveType: '', bodyType: '', doors: 4, seats: 5,
            // Step 3
            condition_grade: 4, mileage: 0, market_value_lkr: 0,
            // Step 4
            on_time_service: false, one_owner: false, no_accident: false, untampered_mileage: false,
        },
        validate: zodResolver(
            active === 0 ? step1Schema :
                active === 1 ? step2Schema :
                    active === 2 ? step3Schema :
                        active === 3 ? step4Schema : undefined
        ),
    });

    /* ── Step navigation ── */
    const nextStep = () => {
        if (active < 4) {
            const res = form.validate();
            if (res.hasErrors) return;
        }
        setActive((s) => Math.min(s + 1, STEPS.length - 1));
    };

    const prevStep = () => setActive((s) => Math.max(s - 1, 0));

    /* ── Image ── */
    const handleImageChange = useCallback((file) => {
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview('');
        }
    }, []);

    /* ── Timeline helpers ── */
    const addEvent = () => setTimeline((prev) => [
        ...prev,
        { id: Date.now(), phase: 'service', source: '', date: '', title: '', detail: '', verified: false },
    ]);
    const removeEvent = (id) => setTimeline((prev) => prev.filter((e) => e.id !== id));
    const updateEvent = (id, field, value) =>
        setTimeline((prev) => prev.map((e) => e.id === id ? { ...e, [field]: value } : e));

    /* ── Submit ── */
    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const vals = form.getValues();
            const id = `AG-CUSTOM-${Date.now()}`;
            const vehicle = {
                id,
                make: vals.make,
                model: vals.model,
                variant: vals.variant,
                year: vals.year,
                color: vals.colorName,
                colorHex: vals.colorHex,
                vin: vals.vin,
                chassisNo: vals.vin,
                engineNo: vals.engineNo,
                fuelType: vals.fuelType,
                displacement: vals.displacement,
                transmission: vals.transmission,
                driveType: vals.driveType,
                bodyType: vals.bodyType,
                doors: vals.doors,
                seats: vals.seats,
                age: new Date().getFullYear() - vals.year,
                mileage: vals.mileage,
                condition_grade: vals.condition_grade,
                condition_label: ['', 'Poor', 'Below Average', 'Fair', 'Good', 'Excellent'][vals.condition_grade] || 'Good',
                market_value_lkr: vals.market_value_lkr,
                thumbnailColor: vals.colorHex,
                image: imagePreview ? '__ls__' : '',
                badges: {
                    on_time_service: vals.on_time_service,
                    one_owner: vals.one_owner,
                    no_accident: vals.no_accident,
                    untampered_mileage: vals.untampered_mileage,
                },
                depreciation: [{ year: vals.year, value: vals.market_value_lkr }],
                timeline: timeline.map(({ id: _id, ...rest }) => ({ ...rest, verified: rest.verified || false })),
                isCustom: true,
            };

            saveVehicle(vehicle);
            if (imagePreview) saveVehicleImage(id, imagePreview);
            refreshVehicles();
            showToast(`${vehicle.make} ${vehicle.model} added to your fleet!`, 'success');
            navigate('/');
        } catch (err) {
            showToast('Failed to save vehicle. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container size="md" py="xl">
            {/* Header */}
            <Button variant="subtle" color="gray" leftSection={<ChevronLeft size={14} />}
                onClick={() => navigate('/')} mb="lg">
                Back to Gallery
            </Button>
            <Text ff="var(--font-display)" fz={40} c="white" lts="0.04em" mb={4}>ADD NEW VEHICLE</Text>
            <Text c="dimmed" fz={14} mb="xl">Complete all 6 steps to create a full vehicle passport record.</Text>

            {/* Stepper */}
            <Stepper active={active} onStepClick={setActive} size="sm" mb="xl" allowNextStepsSelect={false}>
                {STEPS.map((step) => (
                    <Stepper.Step key={step.label} label={step.label} icon={step.icon} />
                ))}
            </Stepper>

            {/* Content panel */}
            <Paper radius="xl" p="xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                {/* ── Step 0: Basic Info ── */}
                {active === 0 && (
                    <Stack gap="lg">
                        <StepHeader title="Basic Information" desc="Start with the vehicle's core identity details." />
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <TextInput label="Make" placeholder="e.g. Toyota" required {...form.getInputProps('make')} />
                            <TextInput label="Model" placeholder="e.g. Aqua" required {...form.getInputProps('model')} />
                            <TextInput label="Variant / Trim" placeholder="e.g. G Grade" {...form.getInputProps('variant')} />
                            <NumberInput label="Year" required min={1900} max={new Date().getFullYear() + 1} {...form.getInputProps('year')} />
                            <TextInput label="Color Name" placeholder="e.g. Pearl White" required {...form.getInputProps('colorName')} />
                            <ColorInput label="Color Hex Code" format="hex" {...form.getInputProps('colorHex')} />
                        </SimpleGrid>
                        <Divider label="Vehicle Photo" labelPosition="left" />
                        <FileInput
                            label="Upload Photo (JPG, PNG, WebP · max 5 MB)"
                            placeholder="Click to upload..."
                            accept="image/*"
                            value={imageFile}
                            onChange={handleImageChange}
                            radius="md"
                        />
                        {imagePreview && (
                            <Box style={{ borderRadius: 10, overflow: 'hidden', maxHeight: 200 }}>
                                <img src={imagePreview} alt="preview" style={{ width: '100%', objectFit: 'cover' }} />
                            </Box>
                        )}
                    </Stack>
                )}

                {/* ── Step 1: Tech Specs ── */}
                {active === 1 && (
                    <Stack gap="lg">
                        <StepHeader title="Technical Specifications" desc="Enter the vehicle's mechanical and registration details." />
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <TextInput label="VIN / Chassis Number" placeholder="e.g. NHP10-1234567" required {...form.getInputProps('vin')} />
                            <TextInput label="Engine Number" placeholder="e.g. 1NZ-B456789" required {...form.getInputProps('engineNo')} />
                            <Select
                                label="Fuel Type" placeholder="Select fuel type" required
                                data={['Hybrid', 'Electric', 'Plug-in Hybrid', 'Petrol', 'Diesel', 'Mild Hybrid (SHVS)']}
                                {...form.getInputProps('fuelType')}
                            />
                            <TextInput label="Engine Displacement" placeholder="e.g. 1500cc or Electric — 217hp" {...form.getInputProps('displacement')} />
                            <TextInput label="Transmission" placeholder="e.g. CVT, 7-Speed DCT, Auto" required {...form.getInputProps('transmission')} />
                            <Select
                                label="Drive Type" placeholder="Select drive type" required
                                data={['FWD', 'RWD', 'AWD', '4WD']}
                                {...form.getInputProps('driveType')}
                            />
                            <Select
                                label="Body Type" placeholder="Select body type" required
                                data={['Sedan', 'Hatchback', 'SUV', 'Crossover SUV', 'MPV', 'Wagon', 'Van', 'Pickup', 'Kei Car / Mini MPV', 'Coupe', 'Convertible']}
                                {...form.getInputProps('bodyType')}
                            />
                            <NumberInput label="Doors" min={2} max={8} {...form.getInputProps('doors')} />
                            <NumberInput label="Seats" min={1} max={15} {...form.getInputProps('seats')} />
                        </SimpleGrid>
                    </Stack>
                )}

                {/* ── Step 2: Condition ── */}
                {active === 2 && (
                    <Stack gap="lg">
                        <StepHeader title="Condition & Value" desc="Describe the vehicle's current condition and market value." />
                        <Box>
                            <Text fz={12} fw={600} tt="uppercase" lts="0.06em" c="dimmed" mb="sm">Condition Grade *</Text>
                            <Group gap="sm">
                                {[1, 2, 3, 4, 5].map((g) => {
                                    const colors = { 1: '#FF4545', 2: '#FF8C42', 3: '#F5C842', 4: '#00C875', 5: '#4A9EFF' };
                                    const labels = { 1: 'Poor', 2: 'Below Avg', 3: 'Fair', 4: 'Good', 5: 'Excellent' };
                                    const selected = form.getValues().condition_grade === g;
                                    return (
                                        <Button
                                            key={g}
                                            variant={selected ? 'filled' : 'outline'}
                                            style={{
                                                borderColor: colors[g],
                                                background: selected ? colors[g] : 'transparent',
                                                color: selected ? '#000' : colors[g],
                                                fontWeight: 700,
                                                minWidth: 72,
                                            }}
                                            onClick={() => form.setFieldValue('condition_grade', g)}
                                        >
                                            {g}★ {labels[g]}
                                        </Button>
                                    );
                                })}
                            </Group>
                        </Box>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <NumberInput label="Mileage (km)" required min={0} max={1000000} step={1000} {...form.getInputProps('mileage')} />
                            <NumberInput label="Market Value (LKR)" required min={1} step={100000} {...form.getInputProps('market_value_lkr')} />
                        </SimpleGrid>
                    </Stack>
                )}

                {/* ── Step 3: Badges ── */}
                {active === 3 && (
                    <Stack gap="lg">
                        <StepHeader title="Trust Badges" desc="Toggle the badges this vehicle has earned." />
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            {[
                                { key: 'on_time_service', label: 'On-Time Service', desc: 'All services done on schedule' },
                                { key: 'one_owner', label: 'Single Owner', desc: 'Only one previous owner' },
                                { key: 'no_accident', label: 'No Accident', desc: 'No recorded accidents' },
                                { key: 'untampered_mileage', label: 'Mileage Verified', desc: 'Odometer not tampered' },
                            ].map(({ key, label, desc }) => (
                                <Paper
                                    key={key} p="md" radius="md"
                                    style={{
                                        border: form.getValues()[key] ? '1px solid rgba(0,200,117,0.3)' : '1px solid rgba(255,255,255,0.07)',
                                        background: form.getValues()[key] ? 'rgba(0,200,117,0.05)' : '#1A1B1E',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    }}
                                >
                                    <Stack gap={2}>
                                        <Text fz={14} fw={600} c="white">{label}</Text>
                                        <Text fz={12} c="dimmed">{desc}</Text>
                                    </Stack>
                                    <Switch
                                        checked={form.getValues()[key]}
                                        onChange={(e) => form.setFieldValue(key, e.currentTarget.checked)}
                                        color="brand"
                                    />
                                </Paper>
                            ))}
                        </SimpleGrid>
                    </Stack>
                )}

                {/* ── Step 4: Timeline ── */}
                {active === 4 && (
                    <Stack gap="lg">
                        <Group justify="space-between">
                            <StepHeader title="Timeline Events" desc="Add key events in the vehicle's history." />
                            <Button
                                size="xs" variant="light" color="brand" leftSection={<Plus size={13} />}
                                onClick={addEvent}
                            >
                                Add Event
                            </Button>
                        </Group>

                        {timeline.length === 0 && (
                            <Alert icon={<AlertCircle size={14} />} color="gray" radius="md">
                                No events yet. Add at least one timeline event.
                            </Alert>
                        )}

                        <Stack gap="sm">
                            {timeline.map((ev, idx) => (
                                <Paper key={ev.id} radius="lg" style={{ border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                                    <Group p="sm" justify="space-between" style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        <Text fz={13} fw={600} c="white">Event {idx + 1} — {ev.phase || 'No phase selected'}</Text>
                                        <ActionIcon size="sm" variant="subtle" color="red" onClick={() => removeEvent(ev.id)}><Minus size={12} /></ActionIcon>
                                    </Group>
                                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" p="md">
                                        <Select
                                            label="Phase"
                                            data={Object.entries(PHASE_COLORS).map(([k, v]) => ({ value: k, label: v.label }))}
                                            value={ev.phase}
                                            onChange={(val) => updateEvent(ev.id, 'phase', val)}
                                            required
                                        />
                                        <TextInput label="Source Name" placeholder="e.g. Toyota Motor Corporation"
                                            value={ev.source} onChange={(e) => updateEvent(ev.id, 'source', e.target.value)} required />
                                        <TextInput label="Date" type="date"
                                            value={ev.date} onChange={(e) => updateEvent(ev.id, 'date', e.target.value)} required />
                                        <TextInput label="Title/Summary" placeholder="e.g. Manufactured at Iwate Plant"
                                            value={ev.title} onChange={(e) => updateEvent(ev.id, 'title', e.target.value)} required />
                                        <Box style={{ gridColumn: '1 / -1' }}>
                                            <Textarea label="Detail" placeholder="Full event description..."
                                                value={ev.detail} onChange={(e) => updateEvent(ev.id, 'detail', e.target.value)}
                                                minRows={2} required />
                                        </Box>
                                        <Switch label="Verified by official source"
                                            checked={ev.verified}
                                            onChange={(e) => updateEvent(ev.id, 'verified', e.currentTarget.checked)}
                                            color="brand"
                                        />
                                    </SimpleGrid>
                                </Paper>
                            ))}
                        </Stack>
                    </Stack>
                )}

                {/* ── Step 5: Review ── */}
                {active === 5 && (
                    <Stack gap="xl">
                        <StepHeader title="Review & Submit" desc="Confirm all details before adding to your fleet." />
                        {(() => {
                            const v = form.getValues();
                            return (
                                <>
                                    {imagePreview && (
                                        <Box style={{ borderRadius: 12, overflow: 'hidden', maxHeight: 180 }}>
                                            <img src={imagePreview} alt="Vehicle" style={{ width: '100%', objectFit: 'cover' }} />
                                        </Box>
                                    )}
                                    <SimpleGrid cols={2} spacing="md">
                                        {[
                                            ['Make', v.make], ['Model', v.model], ['Year', v.year],
                                            ['Color', v.colorName], ['Fuel Type', v.fuelType], ['Transmission', v.transmission],
                                            ['Drive Type', v.driveType], ['Body Type', v.bodyType],
                                            ['Mileage', `${Number(v.mileage).toLocaleString()} km`],
                                            ['Market Value', `LKR ${Number(v.market_value_lkr).toLocaleString()}`],
                                            ['Condition Grade', `${v.condition_grade}/5`],
                                        ].map(([label, val]) => (
                                            <Box key={label}>
                                                <Text fz={10} c="dimmed" tt="uppercase" lts="0.06em">{label}</Text>
                                                <Text fz={14} fw={500} c="white">{val || '—'}</Text>
                                            </Box>
                                        ))}
                                    </SimpleGrid>
                                    <Divider />
                                    <Text fz={13} c="dimmed">{timeline.length} timeline event(s) added</Text>
                                    <Group gap="xs">
                                        {[['on_time_service', 'On-Time Service'], ['one_owner', 'One Owner'],
                                        ['no_accident', 'No Accident'], ['untampered_mileage', 'Mileage Verified']].map(([key, label]) => (
                                            <Badge key={key} variant={v[key] ? 'filled' : 'outline'} color={v[key] ? 'brand' : 'gray'} size="sm">
                                                {label}
                                            </Badge>
                                        ))}
                                    </Group>
                                </>
                            );
                        })()}
                    </Stack>
                )}
            </Paper>

            {/* Navigation */}
            <Group justify="space-between" mt="xl">
                <Button
                    variant="outline" color="gray" radius="md"
                    leftSection={<ChevronLeft size={14} />}
                    onClick={prevStep}
                    disabled={active === 0}
                >
                    Back
                </Button>
                <Text fz={13} c="dimmed">Step {active + 1} of {STEPS.length}</Text>
                {active < STEPS.length - 1 ? (
                    <Button
                        color="brand" radius="md" fw={700}
                        rightSection={<ChevronRight size={14} />}
                        onClick={nextStep}
                    >
                        Continue
                    </Button>
                ) : (
                    <Button
                        color="brand" radius="md" fw={700} size="md"
                        leftSection={<Send size={14} />}
                        onClick={handleSubmit}
                        loading={submitting}
                    >
                        Add to Fleet
                    </Button>
                )}
            </Group>
        </Container>
    );
}

function StepHeader({ title, desc }) {
    return (
        <Box mb="sm">
            <Text ff="var(--font-display)" fz={28} lts="0.04em" c="white">{title.toUpperCase()}</Text>
            <Text fz={13} c="dimmed">{desc}</Text>
            <Divider mt="sm" />
        </Box>
    );
}
