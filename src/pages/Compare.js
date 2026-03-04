import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useApp } from '../context/AppContext';
import VEHICLES from '../data/vehicles';
import { getVehicleById, formatLKR, formatKm, formatDate, getWinner, getAccidentCount } from '../utils/helpers';
import { ArrowLeft, CheckCircle2, XCircle, Check } from 'lucide-react';
import '../styles/Compare.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Compare() {
  const { compareList, addToCompare, removeFromCompare, clearCompare } = useApp();
  const navigate = useNavigate();

  const v1 = compareList[0] ? getVehicleById(compareList[0]) : null;
  const v2 = compareList[1] ? getVehicleById(compareList[1]) : null;

  if (!v1 || !v2) {
    return (
      <div className="page">
        <div className="compare-header">
          <button className="back-btn" onClick={() => navigate('/')}><ArrowLeft size={16} /> Back to Gallery</button>
          <h1 className="section-title">Compare Vehicles</h1>
          <p className="section-subtitle">Select 2 vehicles from the gallery to compare side by side</p>
        </div>
        <div className="compare-selector">
          <div className="compare-selector-grid">
            {VEHICLES.map(v => (
              <div
                key={v.id}
                className={`compare-mini-card ${compareList.includes(v.id) ? 'selected' : ''}`}
                onClick={() => compareList.includes(v.id) ? removeFromCompare(v.id) : addToCompare(v.id)}
              >
                <img src={v.image} alt={`${v.make} ${v.model}`} loading="lazy"
                  style={{ backgroundColor: v.thumbnailColor }}
                  onError={e => { e.target.style.display = 'none'; }} />
                <div className="name">{v.make} {v.model}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.year} · Grade {v.condition_grade}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const comparisonRows = [
    { label: 'Year', key: 'year', v1: v1.year, v2: v2.year },
    { label: 'Age', key: 'age', v1: `${v1.age} years`, v2: `${v2.age} years`, raw1: v1.age, raw2: v2.age },
    { label: 'Mileage', key: 'mileage', v1: formatKm(v1.mileage), v2: formatKm(v2.mileage), raw1: v1.mileage, raw2: v2.mileage },
    { label: 'Condition Grade', key: 'condition_grade', v1: `${v1.condition_grade}/5 — ${v1.condition_label}`, v2: `${v2.condition_grade}/5 — ${v2.condition_label}`, raw1: v1.condition_grade, raw2: v2.condition_grade },
    { label: 'Market Value', key: 'market_value_lkr', v1: formatLKR(v1.market_value_lkr), v2: formatLKR(v2.market_value_lkr) },
    { label: 'Fuel Type', key: 'fuelType', v1: v1.fuelType, v2: v2.fuelType },
    { label: 'Transmission', key: 'transmission', v1: v1.transmission, v2: v2.transmission },
    { label: 'Drive Type', key: 'driveType', v1: v1.driveType, v2: v2.driveType },
    { label: 'Displacement', key: 'displacement', v1: v1.displacement, v2: v2.displacement },
    {
      label: 'Accidents', key: null,
      v1: getAccidentCount(v1) === 0 ? <span className="accident-clean"><CheckCircle2 size={14} /> Clean</span> : <span className="accident-found"><XCircle size={14} /> {getAccidentCount(v1)}</span>,
      v2: getAccidentCount(v2) === 0 ? <span className="accident-clean"><CheckCircle2 size={14} /> Clean</span> : <span className="accident-found"><XCircle size={14} /> {getAccidentCount(v2)}</span>,
    },
  ];

  return (
    <div className="page">
      <div className="compare-header">
        <button className="back-btn" onClick={() => navigate('/')}><ArrowLeft size={16} /> Back to Gallery</button>
        <h1 className="section-title">Compare Vehicles</h1>
        <button className="btn btn-outline btn-sm" style={{ marginTop: 'var(--sp-3)' }} onClick={() => { clearCompare(); }}>Change Vehicles</button>
      </div>

      {/* Heroes */}
      <div className="compare-main">
        <div className="compare-heroes">
          {[v1, v2].map(v => (
            <div key={v.id} className="compare-vehicle-hero">
              <img src={v.image} alt={`${v.make} ${v.model}`} style={{ backgroundColor: v.thumbnailColor }}
                onError={e => { e.target.style.display = 'none'; }} />
              <div className="info">
                <div className="name">{v.make} {v.model}</div>
                <div className="variant">{v.variant} · {v.year}</div>
                <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={() => navigate(`/passport/${v.id}`)}>View Passport</button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Rows */}
        <div className="compare-rows">
          {comparisonRows.map((row, i) => {
            const winner = row.key ? getWinner(row.key, v1, v2) : 'tie';
            return (
              <div key={i} className="compare-row">
                <span className="compare-row-label">{row.label}</span>
                <span className={`compare-row-value ${winner === 'left' ? 'winner' : ''}`}>
                  {row.v1} {winner === 'left' && <span className="compare-winner-badge"><Check size={11} /></span>}
                </span>
                <span className="compare-vs">vs</span>
                <span className={`compare-row-value ${winner === 'right' ? 'winner' : ''}`}>
                  {row.v2} {winner === 'right' && <span className="compare-winner-badge"><Check size={11} /></span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Comparison */}
      <div className="compare-badges">
        <h2 className="section-title" style={{ marginBottom: 'var(--sp-4)' }}>Trust Badges</h2>
        {['on_time_service', 'one_owner', 'no_accident', 'untampered_mileage'].map(key => {
          const labels = { on_time_service: 'On-Time Service', one_owner: 'One Owner', no_accident: 'No Accidents', untampered_mileage: 'Mileage Verified' };
          return (
            <div key={key} className="compare-badge-row">
              <span style={{ textAlign: 'right', color: v1.badges[key] ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                {v1.badges[key] ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              </span>
              <span className="compare-badge-label">{labels[key]}</span>
              <span style={{ color: v2.badges[key] ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                {v2.badges[key] ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              </span>
            </div>
          );
        })}
      </div>

      {/* Depreciation Chart */}
      <div className="compare-main">
        <h2 className="section-title">Depreciation Comparison</h2>
        <CompareDepreciationChart v1={v1} v2={v2} />
      </div>

      {/* Condensed Timeline */}
      <div className="compare-timeline">
        <h2 className="section-title" style={{ marginBottom: 'var(--sp-4)' }}>Key Milestones</h2>
        <CondensedTimeline v1={v1} v2={v2} />
      </div>
    </div>
  );
}

function CompareDepreciationChart({ v1, v2 }) {
  const allYears = [...new Set([...v1.depreciation.map(d => d.year), ...v2.depreciation.map(d => d.year)])].sort();
  const mapValues = (dep) => {
    const m = {};
    dep.forEach(d => m[d.year] = d.value);
    return allYears.map(y => m[y] || null);
  };

  const data = {
    labels: allYears,
    datasets: [
      {
        label: `${v1.make} ${v1.model}`,
        data: mapValues(v1.depreciation),
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
      },
      {
        label: `${v2.make} ${v2.model}`,
        data: mapValues(v2.depreciation),
        borderColor: '#F5C842',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#F5C842',
        borderDash: [5, 5],
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#999', font: { family: "'DM Sans', sans-serif" } } },
      tooltip: {
        backgroundColor: '#181818',
        titleColor: '#f0f0f0',
        bodyColor: '#999',
        callbacks: { label: ctx => ctx.raw ? `LKR ${ctx.raw.toLocaleString()}` : 'N/A' }
      }
    },
    scales: {
      x: { ticks: { color: '#666' }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#666', callback: v => 'LKR ' + (v / 1000000).toFixed(1) + 'M' }, grid: { color: 'rgba(255,255,255,0.04)' } }
    }
  };

  return <Line data={data} options={options} />;
}

function CondensedTimeline({ v1, v2 }) {
  const milestones = ['manufacture', 'first_sale', 'arrival', 'registration', 'service'];
  const labels = { manufacture: 'Manufactured', first_sale: 'First Sold', arrival: 'Arrived in SL', registration: 'Registered SL', service: 'Last Service' };

  return (
    <div>
      {milestones.map(phase => {
        const e1 = phase === 'service'
          ? [...v1.timeline].reverse().find(e => e.phase === 'service')
          : v1.timeline.find(e => e.phase === phase);
        const e2 = phase === 'service'
          ? [...v2.timeline].reverse().find(e => e.phase === 'service')
          : v2.timeline.find(e => e.phase === phase);
        return (
          <div key={phase} className="dual-timeline-row">
            <div className="dual-timeline-date">{e1 ? formatDate(e1.date) : '—'}</div>
            <div className="dual-timeline-event">{labels[phase]}</div>
            <div className="dual-timeline-date">{e2 ? formatDate(e2.date) : '—'}</div>
          </div>
        );
      })}
    </div>
  );
}
