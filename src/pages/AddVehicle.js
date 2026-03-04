import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PHASE_COLORS } from '../data/phaseColors';
import { generateVehicleId, saveCustomVehicle, saveVehicleImage } from '../utils/vehicleStorage';
import {
    Select, SelectItem, Input, Textarea, Toggle, BadgeCard, StepHeader, FormGrid
} from '../components/UIComponents';
import {
    ArrowLeft, ArrowRight, Check, Plus, Trash2, Upload,
    ChevronDown, ChevronUp, CheckCircle2, AlertCircle, ShieldCheck,
    Gauge, User, AlertTriangle, Clock
} from 'lucide-react';
import '../styles/AddVehicle.css';
import '../components/UIComponents.css';

/* ============================================================
   CONSTANTS
   ============================================================ */
const PHASE_OPTIONS = [
    { value: 'manufacture', label: 'Manufacture' },
    { value: 'first_sale', label: 'First Sale' },
    { value: 'service', label: 'Service' },
    { value: 'inspection', label: 'Inspection (JEVIC)' },
    { value: 'export_sale', label: 'Export / Auction Sale' },
    { value: 'export', label: 'Export / Shipping' },
    { value: 'arrival', label: 'Arrival at Port' },
    { value: 'customs', label: 'Customs Clearance' },
    { value: 'registration', label: 'Registration' },
    { value: 'ownership', label: 'Ownership Transfer' },
    { value: 'accident', label: 'Accident Report' },
    { value: 'insurance', label: 'Insurance' },
];

const GRADE_META = {
    1: { label: 'Poor', color: '#FF4545', bg: 'rgba(255,69,69,0.12)' },
    2: { label: 'Below Avg', color: '#FF8C42', bg: 'rgba(255,140,66,0.12)' },
    3: { label: 'Fair', color: '#F5C842', bg: 'rgba(245,200,66,0.12)' },
    4: { label: 'Good', color: '#4A9EFF', bg: 'rgba(74,158,255,0.12)' },
    5: { label: 'Excellent', color: '#00C875', bg: 'rgba(0,200,117,0.12)' },
};

const BADGE_DEFS = [
    { key: 'on_time_service', name: 'On-Time Service', desc: 'All services within schedule', icon: '🔧' },
    { key: 'one_owner', name: 'One Owner', desc: 'Single registered owner', icon: '👤' },
    { key: 'no_accident', name: 'No Accident History', desc: 'No accidents or claims', icon: '🛡️' },
    { key: 'untampered_mileage', name: 'Untampered Mileage', desc: 'Odometer verified at all points', icon: '📍' },
];

const STEPS = ['Basic Info', 'Tech Specs', 'Condition', 'Badges', 'Timeline', 'Review'];

/* ============================================================
   DEFAULT STATE
   ============================================================ */
const DEFAULT_FORM = {
    make: '', model: '', variant: '', year: String(new Date().getFullYear()),
    color: '', colorHex: '#888888',
    imageFile: null, imagePreview: null,
    vin: '', chassisNo: '', engineNo: '',
    fuelType: '', displacement: '', transmission: '',
    driveType: '', bodyType: '',
    doors: '4', seats: '5',
    condition_grade: 0,
    mileage: '', market_value_lkr: '',
    badges: { on_time_service: false, one_owner: false, no_accident: false, untampered_mileage: false },
    timeline: [],
    depreciation: [],
};

/* ============================================================
   VALIDATION — per step, per field
   ============================================================ */
function validateStep(step, form) {
    const errs = {};
    switch (step) {
        case 0:
            if (!form.make.trim()) errs.make = 'Make is required';
            if (!form.model.trim()) errs.model = 'Model is required';
            if (!form.year || Number(form.year) < 1900 || Number(form.year) > 2030) errs.year = 'Enter a valid year (1900–2030)';
            if (!form.color.trim()) errs.color = 'Color name is required';
            if (form.colorHex && !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(form.colorHex.trim())) errs.colorHex = 'Use a valid hex code (e.g. #1A2B3C)';
            break;
        case 1:
            if (!form.vin.trim()) errs.vin = 'VIN / Chassis No is required';
            else if (form.vin.length < 6) errs.vin = 'VIN should be at least 6 characters';
            if (!form.engineNo.trim()) errs.engineNo = 'Engine number is required';
            if (!form.fuelType) errs.fuelType = 'Select a fuel type';
            if (!form.transmission.trim()) errs.transmission = 'Transmission is required';
            if (!form.driveType) errs.driveType = 'Select a drive type';
            if (!form.bodyType) errs.bodyType = 'Select a body type';
            if (!form.doors || Number(form.doors) < 2 || Number(form.doors) > 8) errs.doors = '2–8 doors';
            if (!form.seats || Number(form.seats) < 1 || Number(form.seats) > 15) errs.seats = '1–15 seats';
            break;
        case 2:
            if (!form.condition_grade) errs.condition_grade = 'Pick a condition grade';
            if (!form.mileage || Number(form.mileage) < 0) errs.mileage = 'Enter current mileage';
            else if (Number(form.mileage) > 1000000) errs.mileage = 'Mileage seems too high';
            if (!form.market_value_lkr || Number(form.market_value_lkr) <= 0) errs.market_value_lkr = 'Enter a market value';
            break;
        case 3: break; // Badges optional
        case 4:
            for (let i = 0; i < form.timeline.length; i++) {
                const ev = form.timeline[i];
                if (!ev.title.trim()) errs[`ev_${i}_title`] = 'Title required';
                if (!ev.date) errs[`ev_${i}_date`] = 'Date required';
                if (!ev.source.trim()) errs[`ev_${i}_source`] = 'Source required';
                if (!ev.detail.trim()) errs[`ev_${i}_detail`] = 'Detail required';
            }
            break;
        default: break;
    }
    return errs;
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function AddVehicle() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(DEFAULT_FORM);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    const { showToast } = useApp();

    const updateForm = useCallback((patch) => {
        setForm(prev => ({ ...prev, ...patch }));
        // Clear errors for changed fields
        const changedKeys = Object.keys(patch);
        setFieldErrors(prev => {
            const next = { ...prev };
            changedKeys.forEach(k => delete next[k]);
            return next;
        });
    }, []);

    function handleNext() {
        const errs = validateStep(step, form);
        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            // Auto-expand the first event with error on step 4
            if (step === 4) {
                const firstErrIdx = form.timeline.findIndex((_, i) =>
                    errs[`ev_${i}_title`] || errs[`ev_${i}_date`] ||
                    errs[`ev_${i}_source`] || errs[`ev_${i}_detail`]
                );
                if (firstErrIdx >= 0) {
                    const next = form.timeline.map((ev, i) =>
                        i === firstErrIdx ? { ...ev, expanded: true } : ev
                    );
                    setForm(prev => ({ ...prev, timeline: next }));
                }
            }
            return;
        }
        setFieldErrors({});
        setStep(s => s + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleBack() {
        setFieldErrors({});
        setStep(s => s - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleSubmit() {
        const id = generateVehicleId();
        if (form.imagePreview) saveVehicleImage(id, form.imagePreview);
        const vehicle = {
            id,
            make: form.make.trim(),
            model: form.model.trim(),
            variant: form.variant.trim() || form.model.trim(),
            year: Number(form.year),
            color: form.color.trim(),
            colorHex: form.colorHex,
            vin: form.vin.trim(),
            chassisNo: form.chassisNo.trim() || form.vin.trim(),
            engineNo: form.engineNo.trim(),
            fuelType: form.fuelType,
            transmission: form.transmission.trim(),
            displacement: form.displacement.trim() || 'N/A',
            driveType: form.driveType,
            doors: Number(form.doors),
            seats: Number(form.seats),
            bodyType: form.bodyType,
            age: new Date().getFullYear() - Number(form.year),
            mileage: Number(form.mileage),
            condition_grade: form.condition_grade,
            condition_label: GRADE_META[form.condition_grade]?.label || 'Fair',
            market_value_lkr: Number(form.market_value_lkr),
            image: form.imagePreview ? `__ls__${id}` : '',
            thumbnailColor: form.colorHex,
            badges: form.badges,
            depreciation: form.depreciation
                .map(r => ({ year: Number(r.year), value: Number(r.value) }))
                .filter(r => r.year && r.value),
            timeline: form.timeline.map(ev => ({
                phase: ev.phase,
                source: ev.source,
                sourceType: ev.sourceType,
                date: ev.date,
                mileage: Number(ev.mileage) || 0,
                title: ev.title,
                detail: ev.detail,
                icon: PHASE_ICONS[ev.phase] || '📋',
                verified: ev.verified,
                ...(ev.phase === 'accident' ? { severity: ev.severity } : {}),
            })),
        };
        saveCustomVehicle(vehicle);
        showToast(`${vehicle.make} ${vehicle.model} added successfully!`, 'success');
        setTimeout(() => navigate('/'), 1400);
    }

    const hasErrors = Object.keys(fieldErrors).length > 0;

    return (
        <div className="add-vehicle-page">
            <div className="add-vehicle-container">
                {/* Header */}
                <div className="add-vehicle-header">
                    <button className="add-vehicle-back-btn" onClick={() => navigate('/')}>
                        <ArrowLeft size={15} /> Back to Gallery
                    </button>
                    <h1 className="add-vehicle-title">Add New Vehicle</h1>
                    <p className="add-vehicle-subtitle">Complete all 6 steps to create a full vehicle passport record.</p>
                </div>

                {/* Step Progress */}
                <StepProgress currentStep={step} steps={STEPS} />

                {/* Error Banner */}
                {hasErrors && (
                    <div className="step-error-banner">
                        <AlertCircle size={16} />
                        Please fix the highlighted fields before continuing.
                    </div>
                )}

                {/* Step Panels */}
                <div className="wizard-card active-card">
                    {step === 0 && <Step1BasicInfo form={form} updateForm={updateForm} errors={fieldErrors} />}
                    {step === 1 && <Step2TechSpecs form={form} updateForm={updateForm} errors={fieldErrors} />}
                    {step === 2 && <Step3Condition form={form} updateForm={updateForm} errors={fieldErrors} />}
                    {step === 3 && <Step4Badges form={form} updateForm={updateForm} />}
                    {step === 4 && <Step5Timeline form={form} updateForm={updateForm} errors={fieldErrors} />}
                    {step === 5 && <Step6Review form={form} updateForm={updateForm} />}
                </div>

                {/* Navigation */}
                <div className="wizard-nav">
                    <div className="wizard-nav-left">
                        {step > 0 && (
                            <button className="btn-back" onClick={handleBack}>
                                <ArrowLeft size={15} /> Back
                            </button>
                        )}
                    </div>
                    <span className="step-counter">Step {step + 1} of {STEPS.length}</span>
                    {step < 5 ? (
                        <button className="btn-next" onClick={handleNext}>
                            {step === 4 ? 'Review' : 'Continue'} <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button className="btn-submit" onClick={handleSubmit}>
                            <CheckCircle2 size={16} /> Submit Vehicle
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   STEP PROGRESS
   ============================================================ */
function StepProgress({ currentStep, steps }) {
    return (
        <div className="step-progress">
            {steps.map((label, i) => (
                <React.Fragment key={i}>
                    <div className={`step-item ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}>
                        <div className="step-circle">
                            {i < currentStep ? <Check size={14} strokeWidth={3} /> : i + 1}
                        </div>
                        <span className="step-label">{label}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`step-connector ${i < currentStep ? 'filled' : ''}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

/* ============================================================
   STEP 1 — Basic Info
   ============================================================ */
function Step1BasicInfo({ form, updateForm, errors }) {
    const fileRef = useRef();

    function handleImageChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be under 5 MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => updateForm({ imageFile: file, imagePreview: ev.target.result });
        reader.readAsDataURL(file);
    }

    return (
        <>
            <StepHeader title="Basic Information" description="Start with the vehicle's core identity details." />
            <FormGrid cols={2}>
                <Input
                    label="Make" required
                    placeholder="e.g. Toyota"
                    value={form.make}
                    onChange={e => updateForm({ make: e.target.value })}
                    error={errors.make}
                />
                <Input
                    label="Model" required
                    placeholder="e.g. Aqua"
                    value={form.model}
                    onChange={e => updateForm({ model: e.target.value })}
                    error={errors.model}
                />
                <Input
                    label="Variant / Trim"
                    placeholder="e.g. G Grade"
                    value={form.variant}
                    onChange={e => updateForm({ variant: e.target.value })}
                />
                <Input
                    label="Year" required type="number" min="1900" max="2030"
                    placeholder={String(new Date().getFullYear())}
                    value={form.year}
                    onChange={e => updateForm({ year: e.target.value })}
                    error={errors.year}
                />
                <Input
                    label="Color Name" required
                    placeholder="e.g. Pearl White"
                    value={form.color}
                    onChange={e => updateForm({ color: e.target.value })}
                    error={errors.color}
                />
                <div className="ui-field">
                    <label className="ui-label">Color Hex Code</label>
                    <div className="color-picker-row">
                        <input
                            className={`ui-input ${errors.colorHex ? 'error' : ''}`}
                            placeholder="#F5F5F0"
                            value={form.colorHex}
                            onChange={e => updateForm({ colorHex: e.target.value })}
                        />
                        <input
                            type="color"
                            className="color-swatch-input"
                            value={form.colorHex}
                            onChange={e => updateForm({ colorHex: e.target.value })}
                        />
                    </div>
                    {errors.colorHex && <p className="ui-error-msg">{errors.colorHex}</p>}
                </div>

                {/* Image upload full width */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <label className="ui-label">Vehicle Photo</label>
                    <div style={{ marginTop: 6 }}>
                        {form.imagePreview ? (
                            <div className="image-preview-box">
                                <img src={form.imagePreview} alt="Preview" />
                                <button className="image-preview-remove"
                                    onClick={() => updateForm({ imageFile: null, imagePreview: null })}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ) : (
                            <div className="image-upload-zone" onClick={() => fileRef.current?.click()}>
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange}
                                    onClick={e => e.stopPropagation()} />
                                <div className="upload-icon"><Upload size={30} /></div>
                                <p className="upload-text">Click to upload a vehicle photo</p>
                                <p className="upload-hint">JPG, PNG or WebP · Max 5 MB</p>
                            </div>
                        )}
                    </div>
                </div>
            </FormGrid>
        </>
    );
}

/* ============================================================
   STEP 2 — Technical Specs
   ============================================================ */
function Step2TechSpecs({ form, updateForm, errors }) {
    return (
        <>
            <StepHeader title="Technical Specifications" description="Enter the vehicle's mechanical and registration details." />
            <FormGrid cols={2}>
                <Input
                    label="VIN / Chassis Number" required
                    placeholder="e.g. NHP10-1234567"
                    value={form.vin}
                    onChange={e => updateForm({ vin: e.target.value, chassisNo: e.target.value })}
                    error={errors.vin}
                />
                <Input
                    label="Engine Number" required
                    placeholder="e.g. 1NZ-B456789"
                    value={form.engineNo}
                    onChange={e => updateForm({ engineNo: e.target.value })}
                    error={errors.engineNo}
                />

                <div className="ui-field">
                    <label className="ui-label">Fuel Type <span className="ui-required">*</span></label>
                    <Select value={form.fuelType} onValueChange={v => updateForm({ fuelType: v })}
                        placeholder="Select fuel type" hasError={!!errors.fuelType}>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Mild Hybrid (SHVS)">Mild Hybrid (SHVS)</SelectItem>
                        <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                        <SelectItem value="Full Electric">Full Electric</SelectItem>
                    </Select>
                    {errors.fuelType && <p className="ui-error-msg">{errors.fuelType}</p>}
                </div>

                <Input
                    label="Engine Displacement"
                    placeholder="e.g. 1500cc or Electric — 217hp"
                    value={form.displacement}
                    onChange={e => updateForm({ displacement: e.target.value })}
                />

                <Input
                    label="Transmission" required
                    placeholder="e.g. CVT, 7-Speed DCT, Auto"
                    value={form.transmission}
                    onChange={e => updateForm({ transmission: e.target.value })}
                    error={errors.transmission}
                />

                <div className="ui-field">
                    <label className="ui-label">Drive Type <span className="ui-required">*</span></label>
                    <Select value={form.driveType} onValueChange={v => updateForm({ driveType: v })}
                        placeholder="Select drive type" hasError={!!errors.driveType}>
                        <SelectItem value="FWD">FWD — Front Wheel Drive</SelectItem>
                        <SelectItem value="RWD">RWD — Rear Wheel Drive</SelectItem>
                        <SelectItem value="AWD">AWD — All Wheel Drive</SelectItem>
                        <SelectItem value="AWD (S-AWC)">AWD (S-AWC)</SelectItem>
                        <SelectItem value="4WD">4WD — Four Wheel Drive</SelectItem>
                    </Select>
                    {errors.driveType && <p className="ui-error-msg">{errors.driveType}</p>}
                </div>

                <div className="ui-field" style={{ gridColumn: '1 / -1' }}>
                    <label className="ui-label">Body Type <span className="ui-required">*</span></label>
                    <Select value={form.bodyType} onValueChange={v => updateForm({ bodyType: v })}
                        placeholder="Select body type" hasError={!!errors.bodyType}>
                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Crossover SUV">Crossover SUV</SelectItem>
                        <SelectItem value="Mid-size SUV">Mid-size SUV</SelectItem>
                        <SelectItem value="Kei Car / Mini MPV">Kei Car / Mini MPV</SelectItem>
                        <SelectItem value="MPV / Van">MPV / Van</SelectItem>
                        <SelectItem value="Wagon">Wagon</SelectItem>
                        <SelectItem value="Pickup Truck">Pickup Truck</SelectItem>
                        <SelectItem value="Hatchback EV">Hatchback EV</SelectItem>
                        <SelectItem value="Coupe">Coupe</SelectItem>
                        <SelectItem value="Convertible">Convertible</SelectItem>
                    </Select>
                    {errors.bodyType && <p className="ui-error-msg">{errors.bodyType}</p>}
                </div>

                <Input
                    label="Number of Doors" required type="number" min="2" max="8"
                    value={form.doors}
                    onChange={e => updateForm({ doors: e.target.value })}
                    error={errors.doors}
                />
                <Input
                    label="Number of Seats" required type="number" min="1" max="15"
                    value={form.seats}
                    onChange={e => updateForm({ seats: e.target.value })}
                    error={errors.seats}
                />
            </FormGrid>
        </>
    );
}

/* ============================================================
   STEP 3 — Condition & Value
   ============================================================ */
function Step3Condition({ form, updateForm, errors }) {
    return (
        <>
            <StepHeader title="Condition &amp; Value" description="Set the vehicle's condition grade, mileage, and market value." />

            <div className="ui-field" style={{ marginBottom: 24 }}>
                <label className="ui-label">Condition Grade <span className="ui-required">*</span></label>
                <div className="grade-picker" style={{ marginTop: 8 }}>
                    {[1, 2, 3, 4, 5].map(g => {
                        const meta = GRADE_META[g];
                        return (
                            <button key={g}
                                type="button"
                                className={`grade-btn ${form.condition_grade === g ? 'selected' : ''}`}
                                style={form.condition_grade === g ? {
                                    '--selected-color': meta.color,
                                    '--selected-bg': meta.bg,
                                } : {}}
                                onClick={() => updateForm({ condition_grade: g })}>
                                {g}
                                <span>{meta.label}</span>
                            </button>
                        );
                    })}
                </div>
                {errors.condition_grade && <p className="ui-error-msg" style={{ marginTop: 8 }}><AlertCircle size={12} /> {errors.condition_grade}</p>}
            </div>

            <FormGrid cols={2}>
                <Input
                    label="Current Mileage (km)" required type="number" min="0"
                    placeholder="e.g. 87,450"
                    value={form.mileage}
                    onChange={e => updateForm({ mileage: e.target.value })}
                    error={errors.mileage}
                    hint={form.mileage ? `${Number(form.mileage).toLocaleString()} km` : undefined}
                />
                <Input
                    label="Market Value (LKR)" required type="number" min="0"
                    placeholder="e.g. 8,750,000"
                    value={form.market_value_lkr}
                    onChange={e => updateForm({ market_value_lkr: e.target.value })}
                    error={errors.market_value_lkr}
                    hint={form.market_value_lkr ? `LKR ${Number(form.market_value_lkr).toLocaleString()}` : undefined}
                />
            </FormGrid>
        </>
    );
}

/* ============================================================
   STEP 4 — Trust Badges
   ============================================================ */
function Step4Badges({ form, updateForm }) {
    function toggle(key) {
        updateForm({ badges: { ...form.badges, [key]: !form.badges[key] } });
    }
    return (
        <>
            <StepHeader title="Trust Badges" description="Toggle on the badges this vehicle has earned. These display on the Gallery card and the Passport." />
            <div className="badge-toggles">
                {BADGE_DEFS.map(b => (
                    <BadgeCard
                        key={b.key}
                        icon={b.icon}
                        name={b.name}
                        desc={b.desc}
                        checked={form.badges[b.key]}
                        onChange={() => toggle(b.key)}
                    />
                ))}
            </div>
        </>
    );
}

/* ============================================================
   STEP 5 — Timeline
   ============================================================ */
const PHASE_ICONS = {
    manufacture: '🏭', first_sale: '🤝', service: '🔧', inspection: '🔍',
    export_sale: '🔨', export: '🚢', arrival: '⚓', customs: '📋',
    registration: '📄', ownership: '👤', accident: '⚠️', insurance: '🛡️',
};

function makeBlankEvent() {
    return {
        _id: Math.random().toString(36).slice(2),
        phase: 'service', date: '', mileage: '',
        title: '', detail: '', source: '', sourceType: '',
        verified: true, severity: 'minor', expanded: true,
    };
}

function Step5Timeline({ form, updateForm, errors }) {
    const addEvent = () => updateForm({ timeline: [...form.timeline, makeBlankEvent()] });
    const removeEvent = (idx) => updateForm({ timeline: form.timeline.filter((_, i) => i !== idx) });
    const updateEvent = (idx, patch) => {
        const next = form.timeline.map((ev, i) => i === idx ? { ...ev, ...patch } : ev);
        updateForm({ timeline: next });
        // Clear errors for changed event fields
    };
    const toggleExpand = (idx) => updateEvent(idx, { expanded: !form.timeline[idx].expanded });

    return (
        <>
            <StepHeader
                title="Timeline Events"
                description="Add all history events: manufacture, sales, services, accidents, shipping, registration, ownership. Each event appears in the Passport timeline tabs."
            />

            <div className="timeline-section-title">
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {form.timeline.length} event{form.timeline.length !== 1 ? 's' : ''} added
                </span>
                <button className="add-event-btn" type="button" onClick={addEvent}>
                    <Plus size={14} /> Add Event
                </button>
            </div>

            {form.timeline.length === 0 ? (
                <div className="no-events-msg">
                    <Plus size={28} style={{ opacity: 0.25 }} />
                    <p>No events added yet. Timeline events are optional but make the Passport more complete.</p>
                </div>
            ) : (
                <div className="event-cards-list">
                    {form.timeline.map((ev, idx) => {
                        const phaseColor = PHASE_COLORS?.[ev.phase]?.color || '#999';
                        const hasEvError = errors[`ev_${idx}_title`] || errors[`ev_${idx}_date`] ||
                            errors[`ev_${idx}_source`] || errors[`ev_${idx}_detail`];

                        return (
                            <div key={ev._id} className={`event-card ${hasEvError ? 'event-card-error' : ''}`}>
                                <div className="event-card-header" onClick={() => toggleExpand(idx)}>
                                    <div className="event-card-phase-dot" style={{ background: phaseColor }} />
                                    <span className="event-card-title-text">
                                        {ev.title || PHASE_OPTIONS.find(p => p.value === ev.phase)?.label || 'Event'}
                                    </span>
                                    {hasEvError && <AlertCircle size={14} style={{ color: 'var(--red)', flexShrink: 0 }} />}
                                    <span className="event-card-meta">{ev.date || 'No date'}</span>
                                    <button className="event-card-remove" type="button"
                                        onClick={e => { e.stopPropagation(); removeEvent(idx); }}>
                                        <Trash2 size={14} />
                                    </button>
                                    {ev.expanded ? <ChevronUp size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> :
                                        <ChevronDown size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                                </div>

                                {ev.expanded && (
                                    <div className="event-card-body">
                                        <div className="event-form-grid">
                                            <div className="ui-field">
                                                <label className="ui-label">Phase <span className="ui-required">*</span></label>
                                                <Select value={ev.phase} onValueChange={v => updateEvent(idx, { phase: v })} placeholder="Select phase">
                                                    {PHASE_OPTIONS.map(opt => (
                                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                    ))}
                                                </Select>
                                            </div>

                                            <Input
                                                label="Date" required type="date"
                                                value={ev.date}
                                                onChange={e => updateEvent(idx, { date: e.target.value })}
                                                error={errors[`ev_${idx}_date`]}
                                            />

                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <Input
                                                    label="Event Title" required
                                                    placeholder="e.g. 1st Periodic Service — 15,000km"
                                                    value={ev.title}
                                                    onChange={e => updateEvent(idx, { title: e.target.value })}
                                                    error={errors[`ev_${idx}_title`]}
                                                />
                                            </div>

                                            <Input
                                                label="Source" required
                                                placeholder="e.g. Toyota Motor Corporation"
                                                value={ev.source}
                                                onChange={e => updateEvent(idx, { source: e.target.value })}
                                                error={errors[`ev_${idx}_source`]}
                                            />

                                            <Input
                                                label="Source Type"
                                                placeholder="e.g. Manufacturer"
                                                value={ev.sourceType}
                                                onChange={e => updateEvent(idx, { sourceType: e.target.value })}
                                            />

                                            <Input
                                                label="Odometer at Event (km)" type="number" min="0"
                                                placeholder="e.g. 15,200"
                                                value={ev.mileage}
                                                onChange={e => updateEvent(idx, { mileage: e.target.value })}
                                            />

                                            <div className="ui-field">
                                                <label className="ui-label">Verified Record</label>
                                                <div className="inline-toggle-row">
                                                    <span>Mark as verified</span>
                                                    <Toggle checked={ev.verified} onChange={() => updateEvent(idx, { verified: !ev.verified })} />
                                                </div>
                                            </div>

                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <Textarea
                                                    label="Detail / Description" required
                                                    placeholder="Enter the full details for this event..."
                                                    rows={4}
                                                    value={ev.detail}
                                                    onChange={e => updateEvent(idx, { detail: e.target.value })}
                                                    error={errors[`ev_${idx}_detail`]}
                                                />
                                            </div>

                                            {ev.phase === 'accident' && (
                                                <div style={{ gridColumn: '1 / -1' }}>
                                                    <label className="ui-label">Accident Severity</label>
                                                    <div className="severity-field">
                                                        {['minor', 'moderate', 'major'].map(s => (
                                                            <button key={s} type="button"
                                                                className={`severity-btn ${ev.severity === s ? `selected-${s}` : ''}`}
                                                                onClick={() => updateEvent(idx, { severity: s })}>
                                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

/* ============================================================
   STEP 6 — Depreciation + Review
   ============================================================ */
function Step6Review({ form, updateForm }) {
    const addRow = () => updateForm({
        depreciation: [...form.depreciation, { year: String(new Date().getFullYear()), value: '' }]
    });
    const updateRow = (idx, patch) => updateForm({
        depreciation: form.depreciation.map((r, i) => i === idx ? { ...r, ...patch } : r)
    });
    const removeRow = (idx) => updateForm({
        depreciation: form.depreciation.filter((_, i) => i !== idx)
    });

    const gradeColor = GRADE_META[form.condition_grade]?.color || '#999';

    return (
        <>
            <StepHeader title="Depreciation &amp; Review" description="Add year-by-year value data for the depreciation chart, then review before submitting." />

            <p className="review-section-title">Depreciation History</p>
            <div className="dep-rows">
                {form.depreciation.map((row, idx) => (
                    <div key={idx} className="dep-row">
                        <div className="dep-row-num">{idx + 1}</div>
                        <input className="ui-input" type="number" min="1900" max="2030"
                            placeholder="Year" value={row.year}
                            onChange={e => updateRow(idx, { year: e.target.value })}
                            style={{ width: 110 }} />
                        <input className="ui-input" type="number" min="0"
                            placeholder="Value (LKR)" value={row.value}
                            onChange={e => updateRow(idx, { value: e.target.value })} />
                        <button className="dep-row-remove" type="button" onClick={() => removeRow(idx)}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <button className="add-dep-btn" type="button" onClick={addRow}>
                <Plus size={14} /> Add Year
            </button>

            <div className="review-divider" />

            {/* === REVIEW SUMMARY === */}
            <p className="review-section-title">Full Review</p>
            {form.imagePreview && (
                <img src={form.imagePreview} alt="Vehicle" className="review-image" />
            )}

            <div className="review-grid">
                <ReviewRow label="Make / Model" value={`${form.make} ${form.model}`} />
                <ReviewRow label="Variant" value={form.variant || '—'} />
                <ReviewRow label="Year" value={form.year} />
                <ReviewRow label="Color" value={
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 3, background: form.colorHex, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
                        {form.color}
                    </span>
                } />
                <ReviewRow label="VIN / Chassis" value={form.vin || '—'} />
                <ReviewRow label="Engine No" value={form.engineNo || '—'} />
                <ReviewRow label="Fuel Type" value={form.fuelType || '—'} />
                <ReviewRow label="Displacement" value={form.displacement || '—'} />
                <ReviewRow label="Transmission" value={form.transmission || '—'} />
                <ReviewRow label="Drive Type" value={form.driveType || '—'} />
                <ReviewRow label="Body Type" value={form.bodyType || '—'} />
                <ReviewRow label="Doors / Seats" value={`${form.doors} / ${form.seats}`} />
                <ReviewRow label="Mileage" value={`${Number(form.mileage).toLocaleString()} km`} />
                <ReviewRow label="Market Value" value={`LKR ${Number(form.market_value_lkr).toLocaleString()}`} />
                <ReviewRow label="Condition Grade" value={
                    <span style={{ color: gradeColor, fontWeight: 700 }}>
                        {form.condition_grade} — {GRADE_META[form.condition_grade]?.label}
                    </span>
                } />
                <ReviewRow label="Timeline Events" value={`${form.timeline.length} events`} />
                <ReviewRow label="Depreciation Rows" value={`${form.depreciation.length} years`} />
            </div>

            <p className="review-section-title">Trust Badges</p>
            <div className="review-badges-row">
                {BADGE_DEFS.map(b => (
                    <span key={b.key} className={`review-badge ${form.badges[b.key] ? 'earned' : 'not-earned'}`}>
                        {form.badges[b.key] ? <Check size={11} strokeWidth={3} /> : null}
                        {b.name}
                    </span>
                ))}
            </div>

            {form.timeline.length > 0 && (
                <>
                    <p className="review-section-title">Timeline Preview</p>
                    <div className="review-timeline-list">
                        {form.timeline.map((ev, i) => {
                            const phaseColor = PHASE_COLORS?.[ev.phase]?.color || '#999';
                            return (
                                <div key={i} className="review-timeline-item">
                                    <div className="review-tl-dot" style={{ background: phaseColor }} />
                                    <span className="review-tl-text">{ev.title || ev.phase}</span>
                                    <span className="review-tl-date">{ev.date}</span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </>
    );
}

function ReviewRow({ label, value }) {
    return (
        <div className="review-row">
            <span className="review-label">{label}</span>
            <span className="review-value">{value}</span>
        </div>
    );
}
