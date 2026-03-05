import { z } from 'zod';

// ── Step 1: Basic Information ──────────────────────────────────────
export const step1Schema = z.object({
    make: z.string().min(1, 'Make is required').max(50, 'Max 50 chars'),
    model: z.string().min(1, 'Model is required').max(60, 'Max 60 chars'),
    variant: z.string().max(80, 'Max 80 chars').optional().or(z.literal('')),
    year: z.coerce.number({ invalid_type_error: 'Enter a valid year' })
        .min(1900, 'Year must be ≥ 1900')
        .max(new Date().getFullYear() + 1, 'Year is too far in the future'),
    colorName: z.string().min(1, 'Color name is required').max(40),
    colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #FF0000)')
        .optional().or(z.literal('')),
});

// ── Step 2: Technical Specs ───────────────────────────────────────
export const step2Schema = z.object({
    vin: z.string().min(1, 'VIN / Chassis number is required').max(20, 'Max 20 chars'),
    engineNo: z.string().min(1, 'Engine number is required').max(20, 'Max 20 chars'),
    fuelType: z.string().min(1, 'Fuel type is required'),
    displacement: z.string().max(30).optional().or(z.literal('')),
    transmission: z.string().min(1, 'Transmission is required').max(40),
    driveType: z.string().min(1, 'Drive type is required'),
    bodyType: z.string().min(1, 'Body type is required'),
    doors: z.coerce.number().min(2, 'Min 2 doors').max(8, 'Max 8 doors').optional().or(z.literal('')),
    seats: z.coerce.number().min(1, 'Min 1 seat').max(15, 'Max 15 seats').optional().or(z.literal('')),
});

// ── Step 3: Condition ─────────────────────────────────────────────
export const step3Schema = z.object({
    condition_grade: z.coerce.number({ invalid_type_error: 'Select a condition grade' })
        .min(1).max(5),
    mileage: z.coerce.number({ invalid_type_error: 'Enter a valid mileage' })
        .min(0, 'Mileage cannot be negative')
        .max(1_000_000, 'Mileage seems too high'),
    market_value_lkr: z.coerce.number({ invalid_type_error: 'Enter a valid market value' })
        .positive('Market value must be positive'),
});

// ── Step 4: Badges ────────────────────────────────────────────────
// All optional booleans — no required fields
export const step4Schema = z.object({
    on_time_service: z.boolean().optional(),
    one_owner: z.boolean().optional(),
    no_accident: z.boolean().optional(),
    untampered_mileage: z.boolean().optional(),
});

// ── Step 5: Timeline Events ───────────────────────────────────────
const eventSchema = z.object({
    phase: z.string().min(1, 'Phase is required'),
    source: z.string().min(1, 'Source is required'),
    date: z.string().min(1, 'Date is required'),
    title: z.string().min(1, 'Title is required').max(100, 'Max 100 chars'),
    detail: z.string().min(1, 'Detail is required'),
    verified: z.boolean().optional(),
});

export const step5Schema = z.object({
    timeline: z.array(eventSchema).min(1, 'Add at least one timeline event'),
});

// ── Combined full schema (for final submit) ───────────────────────
export const fullSchema = step1Schema
    .merge(step2Schema)
    .merge(step3Schema)
    .merge(step4Schema)
    .merge(z.object({ timeline: z.array(eventSchema) }));
