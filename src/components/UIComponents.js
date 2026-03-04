/**
 * AutoGenesis — Premium UI Components
 * Built with @radix-ui primitives (shadcn-style) for CRA compatibility.
 * Use these anywhere in the app for consistent, polished inputs.
 */

import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import './UIComponents.css';

/* ============================================================
   SELECT — Premium Radix-powered dropdown
   ============================================================ */
export function Select({ value, onValueChange, placeholder, children, hasError }) {
    return (
        <RadixSelect.Root value={value} onValueChange={onValueChange}>
            <RadixSelect.Trigger
                className={`ui-select-trigger ${hasError ? 'error' : ''}`}
                aria-label={placeholder}
            >
                <RadixSelect.Value placeholder={placeholder} />
                <RadixSelect.Icon className="ui-select-icon">
                    <ChevronDown size={14} />
                </RadixSelect.Icon>
            </RadixSelect.Trigger>

            <RadixSelect.Portal>
                <RadixSelect.Content className="ui-select-content" position="popper" sideOffset={5}>
                    <RadixSelect.ScrollUpButton className="ui-select-scroll-btn">
                        <ChevronUp size={13} />
                    </RadixSelect.ScrollUpButton>
                    <RadixSelect.Viewport className="ui-select-viewport">
                        {children}
                    </RadixSelect.Viewport>
                    <RadixSelect.ScrollDownButton className="ui-select-scroll-btn">
                        <ChevronDown size={13} />
                    </RadixSelect.ScrollDownButton>
                </RadixSelect.Content>
            </RadixSelect.Portal>
        </RadixSelect.Root>
    );
}

export function SelectItem({ value, children, disabled }) {
    return (
        <RadixSelect.Item
            className="ui-select-item"
            value={value}
            disabled={disabled}
        >
            <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
            <RadixSelect.ItemIndicator className="ui-select-item-check">
                <Check size={13} strokeWidth={3} />
            </RadixSelect.ItemIndicator>
        </RadixSelect.Item>
    );
}

export function SelectGroup({ label, children }) {
    return (
        <RadixSelect.Group>
            {label && <RadixSelect.Label className="ui-select-group-label">{label}</RadixSelect.Label>}
            {children}
        </RadixSelect.Group>
    );
}

/* ============================================================
   INPUT — Styled text input with floating label
   ============================================================ */
export function Input({ label, required, error, hint, className = '', ...props }) {
    return (
        <div className="ui-field">
            {label && (
                <label className="ui-label">
                    {label}{required && <span className="ui-required">*</span>}
                </label>
            )}
            <input className={`ui-input ${error ? 'error' : ''} ${className}`} {...props} />
            {error && <p className="ui-error-msg">{error}</p>}
            {hint && !error && <p className="ui-hint">{hint}</p>}
        </div>
    );
}

/* ============================================================
   TEXTAREA
   ============================================================ */
export function Textarea({ label, required, error, hint, className = '', ...props }) {
    return (
        <div className="ui-field">
            {label && (
                <label className="ui-label">
                    {label}{required && <span className="ui-required">*</span>}
                </label>
            )}
            <textarea className={`ui-textarea ${error ? 'error' : ''} ${className}`} {...props} />
            {error && <p className="ui-error-msg">{error}</p>}
            {hint && !error && <p className="ui-hint">{hint}</p>}
        </div>
    );
}

/* ============================================================
   TOGGLE SWITCH — iOS style
   ============================================================ */
export function Toggle({ checked, onChange, id }) {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            className={`ui-toggle ${checked ? 'on' : ''}`}
            onClick={onChange}
        >
            <span className="ui-toggle-knob" />
        </button>
    );
}

/* ============================================================
   BADGE CARD — for trust badge toggles
   ============================================================ */
export function BadgeCard({ icon, name, desc, checked, onChange }) {
    return (
        <div
            className={`ui-badge-card ${checked ? 'on' : ''}`}
            onClick={onChange}
            role="checkbox"
            aria-checked={checked}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onChange()}
        >
            <div className="ui-badge-left">
                <div className="ui-badge-icon">{icon}</div>
                <div>
                    <div className="ui-badge-name">{name}</div>
                    <div className="ui-badge-desc">{desc}</div>
                </div>
            </div>
            <Toggle checked={checked} onChange={onChange} />
        </div>
    );
}

/* ============================================================
   CARD — surface container
   ============================================================ */
export function Card({ children, className = '', glow = false }) {
    return (
        <div className={`ui-card ${glow ? 'glow' : ''} ${className}`}>
            {children}
        </div>
    );
}

/* ============================================================
   STEP HEADER
   ============================================================ */
export function StepHeader({ title, description }) {
    return (
        <div className="ui-step-header">
            <h2 className="ui-step-title">{title}</h2>
            {description && <p className="ui-step-desc">{description}</p>}
        </div>
    );
}

/* ============================================================
   FORM GRID helpers
   ============================================================ */
export function FormGrid({ cols = 2, children }) {
    return (
        <div className={`ui-form-grid cols-${cols}`}>
            {children}
        </div>
    );
}

export function FormField({ children, fullWidth = false }) {
    return (
        <div className={`ui-form-field ${fullWidth ? 'full' : ''}`}>
            {children}
        </div>
    );
}
