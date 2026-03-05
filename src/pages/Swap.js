import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VEHICLES from '../data/vehicles';

import { getVehicleById, formatLKR, formatKm, swapDelta } from '../utils/helpers';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import '../styles/Swap.css';

export default function Swap() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [modalTarget, setModalTarget] = useState(null);
  const source = getVehicleById(id);

  if (!source) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 120 }}>
      <h2>Vehicle not found</h2>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Gallery</button>
    </div>
  );

  const options = VEHICLES.filter(v => v.id !== source.id);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="page">
      <div className="swap-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back to Gallery</button>
        <h1 className="section-title">Vehicle Swap</h1>
        <p>Explore swap possibilities and see the value difference between vehicles</p>
      </div>

      {/* Source Vehicle */}
      <div className="swap-source">
        <div className="swap-source-card">
          <img src={source.image} alt={`${source.make} ${source.model}`} loading="lazy"
            style={{ backgroundColor: source.thumbnailColor }}
            onError={e => { e.target.style.display = 'none'; }} />
          <div className="swap-source-info">
            <div className="swap-source-label">Offering This Vehicle</div>
            <div className="swap-source-name">{source.make} {source.model}</div>
            <div className="swap-source-details">
              <span>Grade {source.condition_grade} · {source.condition_label}</span>
              <span>{formatKm(source.mileage)}</span>
              <span>{source.year}</span>
            </div>
            <div className="swap-source-value">{formatLKR(source.market_value_lkr)}</div>
            <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/')}>Change Vehicle</button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="swap-divider"><span>↔ SWAP WITH</span></div>

      {/* Options */}
      <div className="swap-options">
        <div className="swap-options-grid">
          {options.map(target => {
            const delta = swapDelta(source, target);
            return (
              <div key={target.id} className="swap-option-card" onClick={() => setModalTarget(target)}>
                <img src={target.image} alt={`${target.make} ${target.model}`} loading="lazy"
                  style={{ backgroundColor: target.thumbnailColor }}
                  onError={e => { e.target.style.display = 'none'; }} />
                <div className="swap-option-info">
                  <div className="swap-option-name">{target.make} {target.model}</div>
                  <div className="swap-option-details">
                    <span>Grade {target.condition_grade}</span>
                    <span>{formatKm(target.mileage)}</span>
                    <span>{target.year}</span>
                  </div>
                  <div className={`swap-delta-badge ${delta.color}`}>{delta.label}</div>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: 12, width: '100%' }}>View Swap Details →</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Swap Modal */}
      {modalTarget && (
        <SwapModal source={source} target={modalTarget} onClose={() => setModalTarget(null)} showToast={showToast} />
      )}
    </motion.div>
  );
}

function SwapModal({ source, target, onClose, showToast }) {
  const delta = swapDelta(source, target);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="swap-modal-header">Swap Summary</h2>

        <div className="swap-vs-layout">
          {/* Your Vehicle */}
          <div className="swap-side">
            <div className="swap-side-label give">YOU GIVE</div>
            <img src={source.image} alt={`${source.make} ${source.model}`}
              style={{ backgroundColor: source.thumbnailColor }}
              onError={e => { e.target.style.display = 'none'; }} />
            <div className="name">{source.make} {source.model}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{source.variant} · {source.year}</div>
            <div className="value" style={{ color: 'var(--text-primary)' }}>{formatLKR(source.market_value_lkr)}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Grade {source.condition_grade} · {formatKm(source.mileage)}
            </div>
          </div>

          <div className="swap-vs-badge">VS</div>

          {/* Target Vehicle */}
          <div className="swap-side">
            <div className="swap-side-label receive">YOU RECEIVE</div>
            <img src={target.image} alt={`${target.make} ${target.model}`}
              style={{ backgroundColor: target.thumbnailColor }}
              onError={e => { e.target.style.display = 'none'; }} />
            <div className="name">{target.make} {target.model}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{target.variant} · {target.year}</div>
            <div className="value" style={{ color: 'var(--text-primary)' }}>{formatLKR(target.market_value_lkr)}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Grade {target.condition_grade} · {formatKm(target.mileage)}
            </div>
          </div>
        </div>

        <div className="swap-value-summary">
          <div className="delta" style={{
            color: delta.color === 'green' ? 'var(--primary)' : delta.color === 'red' ? 'var(--red)' : 'var(--gold)'
          }}>
            {delta.label}
          </div>
          <div className="detail">
            <span>Grade: {source.condition_grade}/5 vs {target.condition_grade}/5</span>
            <span>Mileage: {formatKm(source.mileage)} vs {formatKm(target.mileage)}</span>
          </div>
        </div>

        <div className="swap-cta">
          <button className="btn btn-primary" onClick={() => { showToast('Interest expressed! AutoGenesis will contact you.', 'success'); onClose(); }}>
            Express Interest
          </button>
          <p className="note">Connect with AutoGenesis to finalize the swap</p>
        </div>
      </div>
    </div>
  );
}
