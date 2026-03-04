import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import VEHICLES from '../data/vehicles';
import { GRADE_COLORS } from '../data/phaseColors';
import { formatLKR, formatKm } from '../utils/helpers';
import useCountUp from '../hooks/useCountUp';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { getCustomVehicles, getVehicleImage } from '../utils/vehicleStorage';
import { Search, Repeat2, ScanSearch, Factory, BadgeCheck, Flag, Check } from 'lucide-react';
import '../styles/Gallery.css';

export default function Gallery() {
  const [search, setSearch] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { compareList, addToCompare, removeFromCompare } = useApp();
  const navigate = useNavigate();

  const allVehicles = useMemo(() => {
    const custom = getCustomVehicles().map(v => ({
      ...v,
      image: v.image?.startsWith('__ls__') ? (getVehicleImage(v.id) || '') : v.image,
    }));
    return [...VEHICLES, ...custom];
  }, []);

  const filtered = useMemo(() => {
    let results = allVehicles.filter(v => {
      const q = search.toLowerCase();
      const matchQ = !q || `${v.make} ${v.model} ${v.variant}`.toLowerCase().includes(q);
      const matchFuel = !fuelFilter || v.fuelType.toLowerCase().includes(fuelFilter.toLowerCase());
      const matchGrade = !gradeFilter || v.condition_grade === parseInt(gradeFilter);
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
      {/* === HERO === */}
      <section className="gallery-hero">
        <div className="hero-grid-bg" />
        <div className="hero-glow-orb hero-orb-1" />
        <div className="hero-glow-orb hero-orb-2" />
        <div className="hero-content">
          <div className="hero-badge-pill">
            <span className="hero-badge-dot" />
            Vehicle Passport Platform
          </div>
          <h1 className="hero-title">
            Transparent Vehicle<br />
            <span className="hero-title-accent">History &amp; Trust</span>
          </h1>
          <p className="hero-description">
            Every vehicle tells a story. AutoGenesis Passport verifies, documents, and presents
            the complete lifecycle — from factory floor to your driveway.
          </p>
          <div className="hero-cta-row">
            <button className="btn btn-primary btn-hero" onClick={() => document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Fleet
            </button>
            <button className="btn btn-outline btn-hero" onClick={() => navigate('/compare')}>
              Compare Vehicles
            </button>
          </div>
        </div>
      </section>

      {/* === STATS BAR === */}
      <HeroStats />

      {/* === HOW IT WORKS === */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>How AutoGenesis Works</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>Three steps to complete vehicle transparency</p>
          <div className="feature-cards">
            <FeatureCard
              icon={<ScanSearch size={28} />}
              step="01"
              title="Verify"
              description="Every record is cross-verified against official sources — manufacturers, customs, RMV, insurance, and service centers."
            />
            <FeatureCard
              icon={<Repeat2 size={28} />}
              step="02"
              title="Compare"
              description="Side-by-side comparison with winner highlights, depreciation charts, and trust badge analysis across any two passports."
            />
            <FeatureCard
              icon={<Repeat2 size={28} strokeWidth={1.5} style={{ transform: 'rotate(90deg)' }} />}
              step="03"
              title="Swap"
              description="Explore vehicle trade possibilities with instant market value differential calculations and fair-trade indicators."
            />
          </div>
        </div>
      </section>

      {/* === TRUST BAR === */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-items">
            <div className="trust-item">
              <span className="trust-icon"><Factory size={18} /></span>
              <span className="trust-text">Toyota · Honda · Suzuki · Mitsubishi · Nissan</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-item">
              <span className="trust-icon"><BadgeCheck size={18} /></span>
              <span className="trust-text">JEVIC Certified</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-item">
              <span className="trust-icon"><Flag size={18} /></span>
              <span className="trust-text">RMV Sri Lanka Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* === FLEET SECTION === */}
      <section id="fleet-section" className="fleet-section">
        <div className="container">
          <div className="fleet-header">
            <div>
              <h2 className="section-title">Explore Our Fleet</h2>
              <p className="section-subtitle">Each vehicle comes with a verified digital passport</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="gallery-controls">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon-svg" />
            <input
              className="search-input"
              type="text"
              placeholder="Search by make, model, or variant..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search vehicles"
            />
          </div>
          <select className="filter-select" value={fuelFilter} onChange={e => setFuelFilter(e.target.value)} aria-label="Filter by fuel type">
            <option value="">All Fuel Types</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
            <option value="plug-in">Plug-in Hybrid</option>
          </select>
          <select className="filter-select" value={gradeFilter} onChange={e => setGradeFilter(e.target.value)} aria-label="Filter by grade">
            <option value="">All Grades</option>
            <option value="5">Grade 5 — Excellent</option>
            <option value="4">Grade 4 — Good</option>
            <option value="3">Grade 3 — Fair</option>
          </select>
          <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label="Sort vehicles">
            <option value="">Sort by</option>
            <option value="year_desc">Newest First</option>
            <option value="year_asc">Oldest First</option>
            <option value="price_asc">Lowest Price</option>
            <option value="price_desc">Highest Price</option>
            <option value="grade_desc">Best Grade</option>
          </select>
          <span className="results-count">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Vehicle Grid */}
        <div className="gallery-grid">
          {filtered.length === 0 ? (
            <div className="no-results">
              <h3>No Vehicles Found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : filtered.map((v, i) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              index={i}
              isComparing={compareList.includes(v.id)}
              onCompareToggle={handleCompareToggle}
              onViewPassport={() => navigate(`/passport/${v.id}`)}
              onSwap={() => navigate(`/swap/${v.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ===== HERO STATS ===== */
function HeroStats() {
  const [ref, isVisible] = useIntersectionObserver();
  const vehicles = useCountUp(5, 800, n => n, isVisible);
  const records = useCountUp(47, 1200, n => n, isVisible);
  const trust = useCountUp(3200, 1600, n => n.toLocaleString(), isVisible);

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

/* ===== FEATURE CARD ===== */
function FeatureCard({ icon, step, title, description }) {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div ref={ref} className={`feature-card ${isVisible ? 'visible' : ''}`}>
      <div className="feature-step">{step}</div>
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>
    </div>
  );
}

/* ===== VEHICLE CARD ===== */
function VehicleCard({ vehicle: v, index, isComparing, onCompareToggle, onViewPassport, onSwap }) {
  const [ref, isVisible] = useIntersectionObserver();
  const gradeColor = GRADE_COLORS[v.condition_grade] || '#999';
  const badgeNames = ['On-Time Service', 'One Owner', 'No Accident', 'Mileage Verified'];
  const badgeKeys = ['on_time_service', 'one_owner', 'no_accident', 'untampered_mileage'];

  return (
    <article
      ref={ref}
      className={`vehicle-card ${isComparing ? 'selected' : ''} ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="card-image-wrap" style={{ backgroundColor: v.thumbnailColor }}>
        <img src={v.image} alt={`${v.make} ${v.model}`} loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }} />
        <div
          className="card-grade-badge"
          style={{ background: gradeColor, color: v.condition_grade <= 1 ? '#fff' : '#000' }}
        >
          {v.condition_grade}★
        </div>
        <div
          className={`card-compare-check ${isComparing ? 'checked' : ''}`}
          onClick={(e) => { e.stopPropagation(); onCompareToggle(v.id); }}
          role="checkbox"
          aria-checked={isComparing}
          aria-label={`Compare ${v.make} ${v.model}`}
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onCompareToggle(v.id)}
        >
          {isComparing ? <Check size={12} strokeWidth={3} /> : ''}
        </div>
      </div>
      <div className="card-body">
        <div className="card-make-model">{v.make} {v.model}</div>
        <div className="card-variant">{v.variant} · {v.year}</div>
        <div className="card-stats-row">
          <div className="stat-item">
            <span className="stat-value">{v.age}y</span>
            <span className="stat-label">Age</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatKm(v.mileage)}</span>
            <span className="stat-label">Mileage</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" style={{ color: gradeColor }}>{v.condition_grade}/5</span>
            <span className="stat-label">Grade</span>
          </div>
        </div>
        <div className="card-value">{formatLKR(v.market_value_lkr)}</div>
        <div className="card-badges-mini">
          {badgeKeys.map((key, i) => (
            <span
              key={key}
              className={`badge-dot ${v.badges[key] ? 'earned' : 'not-earned'}`}
              title={badgeNames[i]}
            />
          ))}
        </div>
        <div className="card-actions">
          <button className="btn btn-primary btn-sm" onClick={onViewPassport}>View Passport</button>
          <button className="btn btn-outline btn-sm" onClick={onSwap}>Swap</button>
        </div>
      </div>
    </article>
  );
}
