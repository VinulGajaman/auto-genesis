import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, Plus, GitCompare, Car, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { compareList } = useApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div
        className="nav-logo"
        onClick={() => navigate('/')}
        tabIndex={0} role="button"
        onKeyDown={e => e.key === 'Enter' && navigate('/')}
        aria-label="Go to gallery"
      >
        <span className="nav-logo-auto">AUTO</span>
        <span className="nav-logo-gen">GENESIS</span>
        <span className="nav-logo-dot" />
      </div>

      {/* Center nav links */}
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavLink
          label="Vehicles"
          icon={<Car size={14} />}
          active={isActive('/')}
          onClick={() => navigate('/')}
        />
        <div className="nav-sep" />
        <NavLink
          label="Compare"
          icon={<GitCompare size={14} />}
          active={isActive('/compare')}
          onClick={() => navigate('/compare')}
          badge={compareList.length > 0 ? compareList.length : undefined}
        />
      </div>

      {/* Right CTA */}
      <div className="nav-right">
        <button
          className={`nav-add-btn ${isActive('/add-vehicle') ? 'active' : ''}`}
          onClick={() => navigate('/add-vehicle')}
          aria-label="Add a vehicle"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Add Vehicle</span>
          <ChevronRight size={13} className="nav-add-arrow" />
        </button>

        <button
          className="nav-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
}

function NavLink({ label, icon, active, onClick, badge }) {
  return (
    <button
      className={`nav-link-btn ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="nav-link-icon">{icon}</span>
      {label}
      {badge !== undefined && (
        <span className="nav-compare-badge">{badge}</span>
      )}
    </button>
  );
}
