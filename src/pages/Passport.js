import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useApp } from '../context/AppContext';
import { PHASE_COLORS, TAB_FILTERS, GRADE_COLORS } from '../data/phaseColors';
import { getVehicleById, formatLKR, formatKm, formatDate, getServiceStatus, calcDepreciationStats, getPlateNumber, getAccidentCount } from '../utils/helpers';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import useCountUp from '../hooks/useCountUp';
import {
  ArrowLeft, GitCompare, ArrowLeftRight, Link2, Download,
  Wrench, User, ShieldCheck, Gauge,
  CheckCircle2, XCircle, Check,
  MapPin, Ship, Building2, Flag,
  Sparkles
} from 'lucide-react';
import '../styles/Passport.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Passport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = getVehicleById(id);
  const [activeTab, setActiveTab] = useState('timeline');
  const { addToCompare, showToast } = useApp();

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!vehicle) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 120 }}>
      <h2>Vehicle not found</h2>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Gallery</button>
    </div>
  );

  const plate = getPlateNumber(vehicle);
  const accidentCount = getAccidentCount(vehicle);
  const depStats = calcDepreciationStats(vehicle);

  return (
    <div className="page" id="page-passport">
      <button className="back-btn" onClick={() => navigate('/')}><ArrowLeft size={16} /> Back to Gallery</button>

      {/* Hero */}
      <div className="passport-hero" style={{ backgroundImage: `url(${vehicle.image})`, backgroundColor: vehicle.thumbnailColor }}>
        <div className="passport-hero-overlay" />
        <div className="passport-hero-content">
          <div className="passport-badge"><Sparkles size={13} /> AutoGenesis Passport</div>
          <h1 className="passport-vehicle-name">{vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}</h1>
          <p className="passport-variant">{vehicle.variant} · {vehicle.year} · {vehicle.color}</p>
          {plate && <div className="passport-plate">{plate}</div>}
          <div className="passport-vin">VIN: {vehicle.vin}</div>
        </div>
        <div className="passport-hero-verified">
          <div className="verified-check"><Check size={16} strokeWidth={3} /></div>
          VERIFIED PASSPORT
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats vehicle={vehicle} />

      {/* Grade + Badges */}
      <GradeBadges vehicle={vehicle} />

      {/* Specs */}
      <SpecsTable vehicle={vehicle} />

      {/* Tabs */}
      <div className="passport-tabs-section">
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} accidentCount={accidentCount} />
        <div className="tab-content" key={activeTab}>
          {activeTab === 'timeline' && <FullTimeline vehicle={vehicle} />}
          {activeTab === 'accident' && <AccidentHistory vehicle={vehicle} />}
          {activeTab === 'travel' && <TravelHistory vehicle={vehicle} />}
          {activeTab === 'ownership' && <OwnershipHistory vehicle={vehicle} />}
          {activeTab === 'service' && <ServiceHistory vehicle={vehicle} />}
          {activeTab === 'registration' && <RegistrationHistory vehicle={vehicle} />}
        </div>
      </div>

      {/* Depreciation Chart */}
      <div className="passport-depreciation">
        <div className="depreciation-card">
          <div className="depreciation-header">
            <div>
              <h2 className="section-title">Depreciation History</h2>
              <p className="section-subtitle">Market Value Over Time</p>
            </div>
            <div className="depreciation-current-value">{formatLKR(vehicle.market_value_lkr)}</div>
          </div>
          <DepreciationChart vehicle={vehicle} />
          <div className="depreciation-stats">
            <div className="dep-stat">
              <div className="dep-value" style={{ color: 'var(--red)' }}>{formatLKR(depStats.totalLoss)}</div>
              <div className="dep-label">Total Depreciation ({depStats.totalPercent}%)</div>
            </div>
            <div className="dep-stat">
              <div className="dep-value">{formatLKR(depStats.annualAvg)}</div>
              <div className="dep-label">Average Annual Depreciation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="passport-action-bar">
        <button className="btn btn-primary" onClick={() => { addToCompare(vehicle.id); }}>
          <GitCompare size={15} /> Compare
        </button>
        <button className="btn btn-gold" onClick={() => navigate(`/swap/${vehicle.id}`)}>
          <ArrowLeftRight size={15} /> Swap
        </button>
        <button className="btn btn-outline" onClick={() => { navigator.clipboard?.writeText(`https://autogenesis.lk/passport/${vehicle.id}`); showToast('Passport URL copied to clipboard!', 'success'); }}>
          <Link2 size={15} /> Share Passport
        </button>
        <button className="btn btn-outline" style={{ opacity: 0.5 }} onClick={() => showToast('PDF download coming soon!', 'info')}>
          <Download size={15} /> Download PDF <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 4 }}>Coming Soon</span>
        </button>
      </div>
    </div>
  );
}

/* ===== QUICK STATS COMPONENT ===== */
function QuickStats({ vehicle }) {
  const [ref, isVisible] = useIntersectionObserver();
  const ageVal = useCountUp(vehicle.age, 1200, n => `${n} Years`, isVisible);
  const mileageVal = useCountUp(vehicle.mileage, 2000, n => `${n.toLocaleString()} km`, isVisible);
  const valueVal = useCountUp(vehicle.market_value_lkr, 1800, n => `LKR ${n.toLocaleString()}`, isVisible);

  return (
    <div className="passport-quick-stats" ref={ref}>
      <div className="stat-column">
        <div className="stat-number">{ageVal}</div>
        <div className="stat-sub-label">AGE</div>
        <div className="stat-detail">Manufactured {vehicle.year}</div>
      </div>
      <div className="stat-column">
        <div className="stat-number">{mileageVal}</div>
        <div className="stat-sub-label">MILEAGE</div>
        <div className="stat-detail">Verified across {vehicle.timeline.length} checkpoints</div>
      </div>
      <div className="stat-column">
        <div className="stat-number green">{valueVal}</div>
        <div className="stat-sub-label">MARKET VALUE</div>
        <div className="stat-detail">Current market estimate</div>
      </div>
    </div>
  );
}

/* ===== GRADE + BADGES ===== */
function GradeBadges({ vehicle }) {
  const [ref, isVisible] = useIntersectionObserver();
  const gradeColor = GRADE_COLORS[vehicle.condition_grade] || '#999';
  const circumference = 2 * Math.PI * 54;
  const offset = isVisible ? circumference - (vehicle.condition_grade / 5) * circumference : circumference;

  const badges = [
    { key: 'on_time_service', icon: <Wrench size={22} />, title: 'On-Time Service', desc: 'All services completed within schedule' },
    { key: 'one_owner', icon: <User size={22} />, title: 'One Owner', desc: 'Only one registered owner since new' },
    { key: 'no_accident', icon: <ShieldCheck size={22} />, title: 'No Accident History', desc: 'No accidents or claims recorded' },
    { key: 'untampered_mileage', icon: <Gauge size={22} />, title: 'Untampered Mileage', desc: 'Odometer verified at all checkpoints' },
  ];

  return (
    <div className="passport-grade-section" ref={ref}>
      <div className="grade-gauge">
        <div className="grade-ring-wrap">
          <svg viewBox="0 0 120 120" width="140" height="140">
            <circle cx="60" cy="60" r="54" className="grade-ring-bg" />
            <circle
              cx="60" cy="60" r="54"
              className="grade-ring-fill"
              style={{
                stroke: gradeColor,
                strokeDasharray: circumference,
                strokeDashoffset: offset,
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </svg>
          <div className="grade-number" style={{ color: gradeColor }}>{vehicle.condition_grade}</div>
        </div>
        <div className="grade-label" style={{ color: gradeColor }}>{vehicle.condition_label}</div>
        <div className="grade-sublabel">AutoGenesis Condition Grade</div>
      </div>
      <div className="badges-grid">
        {badges.map((b, i) => (
          <div
            key={b.key}
            className={`badge-card ${vehicle.badges[b.key] ? 'earned' : 'not-earned'}`}
            style={isVisible ? { animation: `badgeBounce 0.4s ease ${i * 100 + 400}ms both` } : {}}
          >
            <div className="badge-status">
              {vehicle.badges[b.key] ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <div className="badge-icon">{b.icon}</div>
            <div className="badge-title">{b.title}</div>
            <div className="badge-desc">{b.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== SPECS TABLE ===== */
function SpecsTable({ vehicle }) {
  const specs = [
    ['Make / Model', `${vehicle.make} ${vehicle.model} ${vehicle.variant}`],
    ['Year', vehicle.year],
    ['Body Type', vehicle.bodyType],
    ['Fuel Type', vehicle.fuelType],
    ['Engine', `${vehicle.engineNo.split('-')[0]} ${vehicle.displacement}`],
    ['Transmission', vehicle.transmission],
    ['Drive Type', vehicle.driveType],
    ['Doors / Seats', `${vehicle.doors} / ${vehicle.seats}`],
    ['Color', `${vehicle.color} (${vehicle.colorHex})`],
    ['VIN / Chassis', vehicle.chassisNo],
    ['Engine Number', vehicle.engineNo],
  ];

  return (
    <section className="passport-specs">
      <h2 className="section-title">Vehicle Specifications</h2>
      <div className="specs-grid">
        {specs.map(([label, value]) => (
          <div className="spec-row" key={label}>
            <span className="spec-label">{label}</span>
            <span className="spec-value">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== TAB BAR ===== */
function TabBar({ activeTab, setActiveTab, accidentCount }) {
  const tabs = [
    { key: 'timeline', label: 'Full Timeline' },
    { key: 'accident', label: 'Accident History', count: accidentCount },
    { key: 'travel', label: 'Travel History' },
    { key: 'ownership', label: 'Ownership' },
    { key: 'service', label: 'Service History' },
    { key: 'registration', label: 'Registration' },
  ];

  return (
    <div className="tab-bar" role="tablist">
      {tabs.map(t => (
        <button
          key={t.key}
          className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
          onClick={() => setActiveTab(t.key)}
          role="tab"
          aria-selected={activeTab === t.key}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="tab-count" style={{
              background: t.count > 0 ? 'var(--red)' : 'var(--primary)',
              color: '#000'
            }}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ===== FULL TIMELINE ===== */
function FullTimeline({ vehicle }) {
  return (
    <div className="timeline">
      {vehicle.timeline.map((event, i) => (
        <TimelineNode key={i} event={event} index={i} />
      ))}
    </div>
  );
}

function TimelineNode({ event, index }) {
  const [ref, isVisible] = useIntersectionObserver();
  const [expanded, setExpanded] = useState(false);
  const phase = PHASE_COLORS[event.phase] || { color: '#999', bg: 'rgba(255,255,255,0.05)' };
  const isLong = event.detail.length > 120;

  return (
    <div
      ref={ref}
      className={`timeline-node ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="node-dot" style={{
        background: phase.color,
        boxShadow: `0 0 8px ${phase.color}`,
        animation: event.phase === 'accident' ? 'pulse-red 2s infinite' : undefined,
      }} />
      <div className={`node-card ${event.phase === 'accident' ? 'accident' : ''}`}>
        <div className="node-header">
          <span className="node-icon" style={{ background: phase.bg, color: phase.color }}>{event.icon}</span>
          <div style={{ flex: 1 }}>
            <div className="node-title">{event.title}</div>
            <div className="node-date">{formatDate(event.date)}</div>
          </div>
          {event.verified && <span className="node-verified"><Check size={11} strokeWidth={3} /> Verified</span>}
          {event.severity && <span className={`severity-badge ${event.severity}`}>{event.severity}</span>}
        </div>
        <div className="node-source">Source: {event.source} · {event.sourceType}</div>
        <div className={`node-detail ${!expanded && isLong ? 'collapsed' : ''}`}>{event.detail}</div>
        {isLong && <button className="read-more" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show less' : '...Read more'}</button>}
        {event.mileage !== undefined && (
          <div className="node-mileage">
            <MapPin size={12} /> Odometer: {formatKm(event.mileage)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== ACCIDENT HISTORY ===== */
function AccidentHistory({ vehicle }) {
  const accidents = vehicle.timeline.filter(TAB_FILTERS.accident);
  if (accidents.length === 0) {
    return (
      <div className="accident-clean-banner">
        <div className="clean-icon"><CheckCircle2 size={40} /></div>
        <h3>Clean Accident Record</h3>
        <p>No accidents or insurance claims found across all verified data sources.</p>
      </div>
    );
  }
  return (
    <div>
      <div className="accident-summary-bar">
        <span className="accident-count">{accidents.length} Accident{accidents.length > 1 ? 's' : ''} Recorded</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Minor: {accidents.filter(a => a.severity === 'minor').length} · Moderate: {accidents.filter(a => a.severity === 'moderate').length}
        </span>
      </div>
      {accidents.map((acc, i) => (
        <TimelineNode key={i} event={acc} index={i} />
      ))}
    </div>
  );
}

/* ===== TRAVEL HISTORY ===== */
function TravelHistory({ vehicle }) {
  const travelEvents = vehicle.timeline.filter(TAB_FILTERS.travel);
  const exportEvent = vehicle.timeline.find(e => e.phase === 'export');
  const arrivalEvent = vehicle.timeline.find(e => e.phase === 'arrival');

  let transitDays = 0;
  if (exportEvent && arrivalEvent) {
    transitDays = Math.round((new Date(arrivalEvent.date) - new Date(exportEvent.date)) / (1000 * 60 * 60 * 24));
  }

  return (
    <div>
      <div className="travel-route-visual">
        <div className="travel-country">
          <div className="flag flag-jp"><Flag size={22} /></div>
          <div className="name">JAPAN</div>
        </div>
        <div className="travel-line">
          <span className="travel-ship"><Ship size={22} /></span>
        </div>
        <div className="travel-country">
          <div className="flag flag-lk"><Flag size={22} /></div>
          <div className="name">SRI LANKA</div>
        </div>
      </div>
      <div className="travel-stops">
        {travelEvents.map((ev, i) => (
          <div key={i} className="travel-stop">
            <span className="travel-stop-icon">{ev.icon}</span>
            <div className="travel-stop-text">
              <strong>{ev.title}</strong> — {formatDate(ev.date)}
              <br /><span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{ev.source}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="travel-stats-row">
        <div className="travel-stat">
          <div className="stat-value">~7,200 km</div>
          <div className="stat-label">Total Distance (Japan → Sri Lanka)</div>
        </div>
        <div className="travel-stat">
          <div className="stat-value">{transitDays} days</div>
          <div className="stat-label">Sea Transit Time</div>
        </div>
      </div>
    </div>
  );
}

/* ===== OWNERSHIP HISTORY ===== */
function OwnershipHistory({ vehicle }) {
  const owners = vehicle.timeline.filter(TAB_FILTERS.ownership);

  return (
    <div>
      {owners.map((owner, i) => {
        const nameMatch = owner.detail.match(/(?:Mr\.|Ms\.|Mrs\.|Dr\.)\s([A-Z])\w*\s(\w+)/);
        const initials = nameMatch ? `${nameMatch[1]}${nameMatch[2][0]}` : '??';
        const privacyName = nameMatch ? `${nameMatch[0].split(' ').map((w, j) => j === 0 ? w : j === 1 ? w[0] + '.' : w).join(' ')}` : owner.source;
        const locationMatch = owner.detail.match(/,\s*([^,]+(?:,\s*[A-Z][a-z]+\s*\d*)?\.?\s*(?:NIC|Purchased|Fleet))/);
        const location = locationMatch ? locationMatch[1].trim() : '';
        const isLast = i === owners.length - 1;
        const isCorporate = owner.detail.toLowerCase().includes('ltd') || owner.detail.toLowerCase().includes('corporate');

        return (
          <div key={i} className="ownership-card">
            <div className="owner-avatar">{initials}</div>
            <div className="owner-info">
              <div className="owner-number">Owner #{i + 1}</div>
              <div className="owner-name">{privacyName}</div>
              {location && (
                <div className="owner-location">
                  <MapPin size={12} /> {location}
                </div>
              )}
              <div className="owner-period">From {formatDate(owner.date)}{isLast ? ' — Present' : ''}</div>
              <div className="owner-mileage">
                <Gauge size={12} /> Odometer: {formatKm(owner.mileage)}
              </div>
              <span className={`owner-type-badge ${isLast ? 'current' : isCorporate ? 'corporate' : 'private'}`}>
                {isLast
                  ? <><span className="owner-dot" /> Current</>
                  : isCorporate
                    ? <><Building2 size={12} /> Corporate</>
                    : <><User size={12} /> Private</>
                }
              </span>
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 'var(--sp-4)', fontSize: 14, color: 'var(--text-muted)' }}>
        Total owners: {owners.length}
      </div>
    </div>
  );
}

/* ===== SERVICE HISTORY ===== */
function ServiceHistory({ vehicle }) {
  const services = vehicle.timeline.filter(TAB_FILTERS.service);
  const avgInterval = services.length > 1
    ? Math.round(services.reduce((acc, s, i) => i === 0 ? 0 : acc + (s.mileage - services[i - 1].mileage), 0) / (services.length - 1))
    : 0;
  const onTimeCount = services.filter(s => getServiceStatus(s, vehicle.timeline).status === 'on_time').length;
  const onTimeRate = services.length > 0 ? Math.round((onTimeCount / services.length) * 100) : 100;

  return (
    <div>
      <div className="service-summary">
        <div className="service-stat">
          <div className="stat-value">{services.length}</div>
          <div className="stat-label">Total Services</div>
        </div>
        <div className="service-stat">
          <div className="stat-value">{services.length > 0 ? formatDate(services[services.length - 1].date) : 'N/A'}</div>
          <div className="stat-label">Last Service</div>
        </div>
        <div className="service-stat">
          <div className="stat-value">{avgInterval > 0 ? formatKm(avgInterval) : 'N/A'}</div>
          <div className="stat-label">Avg Service Interval</div>
        </div>
        <div className="service-stat">
          <div className="stat-value" style={{ color: onTimeRate >= 80 ? 'var(--primary)' : 'var(--orange)' }}>{onTimeRate}%</div>
          <div className="stat-label">On-Time Rate</div>
        </div>
      </div>
      <table className="service-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Mileage</th>
            <th>Service Center</th>
            <th>Work Done</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s, i) => {
            const status = getServiceStatus(s, vehicle.timeline);
            return (
              <tr key={i}>
                <td>{formatDate(s.date)}</td>
                <td>{formatKm(s.mileage)}</td>
                <td>{s.source}</td>
                <td style={{ maxWidth: 300, fontSize: 13 }}>{s.title}</td>
                <td>{status.label}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ===== REGISTRATION HISTORY ===== */
function RegistrationHistory({ vehicle }) {
  const regEvents = vehicle.timeline.filter(TAB_FILTERS.registration);

  return (
    <div>
      {regEvents.map((reg, i) => {
        const isSL = reg.detail.toLowerCase().includes('sri lanka') || reg.detail.toLowerCase().includes('rmv');
        const plateMatch = reg.detail.match(/(?:Plate|Registration number|number plate):?\s*([A-Z\s\-\d]+)/i);
        const plate = plateMatch ? plateMatch[1].trim() : '';

        return (
          <div key={i} className="registration-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', marginBottom: 'var(--sp-3)' }}>
              <span className={`country-flag-icon ${isSL ? 'flag-lk' : 'flag-jp'}`}>
                <Flag size={28} />
                <span className="flag-label">{isSL ? 'LK' : 'JP'}</span>
              </span>
              {plate && <span className={isSL ? 'plate-sl' : 'plate-jp'}>{plate}</span>}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              <p><strong>Date:</strong> {formatDate(reg.date)}</p>
              <p><strong>Authority:</strong> {reg.source}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>{reg.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===== DEPRECIATION CHART ===== */
function DepreciationChart({ vehicle }) {
  const chartRef = useRef(null);

  const data = {
    labels: vehicle.depreciation.map(d => d.year),
    datasets: [{
      label: `${vehicle.make} ${vehicle.model}`,
      data: vehicle.depreciation.map(d => d.value),
      borderColor: '#3b82f6',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(59,130,246,0.3)');
        gradient.addColorStop(1, 'rgba(59,130,246,0)');
        return gradient;
      },
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#111',
      pointBorderWidth: 2,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { labels: { color: '#999', font: { family: "'DM Sans', sans-serif" } } },
      tooltip: {
        backgroundColor: '#181818',
        titleColor: '#f0f0f0',
        bodyColor: '#999',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: { label: ctx => `LKR ${ctx.raw.toLocaleString()}` }
      }
    },
    scales: {
      x: { ticks: { color: '#666', font: { family: "'DM Sans', sans-serif" } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: {
        ticks: { color: '#666', callback: v => 'LKR ' + (v / 1000000).toFixed(1) + 'M', font: { family: "'DM Sans', sans-serif" } },
        grid: { color: 'rgba(255,255,255,0.04)' }
      }
    }
  };

  return <Line ref={chartRef} data={data} options={options} />;
}
