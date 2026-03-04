import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getVehicleById } from '../utils/helpers';
import '../styles/Components.css';

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useApp();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  const vehicles = compareList.map(id => getVehicleById(id)).filter(Boolean);

  return (
    <div className={`compare-bar ${compareList.length > 0 ? 'visible' : ''}`}>
      <div className="compare-bar-inner">
        <div className="compare-bar-vehicles">
          {vehicles.map(v => (
            <div key={v.id} className="compare-bar-vehicle">
              <div className="compare-bar-thumb" style={{ backgroundColor: v.thumbnailColor }}>
                <img src={v.image} alt={`${v.make} ${v.model}`} loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <span className="compare-bar-name">{v.make} {v.model}</span>
              <button className="compare-bar-remove" onClick={() => removeFromCompare(v.id)} aria-label={`Remove ${v.make} ${v.model}`}>×</button>
            </div>
          ))}
        </div>
        <div className="compare-bar-actions">
          {compareList.length === 2 && (
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/compare')}>
              Compare Now →
            </button>
          )}
          <button className="compare-bar-clear" onClick={clearCompare}>Clear All</button>
        </div>
      </div>
    </div>
  );
}
