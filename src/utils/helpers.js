import VEHICLES from '../data/vehicles';
import { getCustomVehicleById, getVehicleImage } from './vehicleStorage';

export function formatLKR(n) {
  return `LKR ${n.toLocaleString()}`;
}

export function formatKm(n) {
  return `${n.toLocaleString()} km`;
}

export function formatDate(isoString) {
  const d = new Date(isoString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function timeBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = date2 ? new Date(date2) : new Date();
  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  if (months < 0) { years--; months += 12; }
  const parts = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  return parts.join(' ') || 'Less than a month';
}

export function getVehicleById(id) {
  const staticV = VEHICLES.find(v => v.id === id);
  if (staticV) return staticV;
  const custom = getCustomVehicleById(id);
  if (!custom) return null;
  // Resolve localStorage image reference
  if (custom.image?.startsWith('__ls__')) {
    return { ...custom, image: getVehicleImage(id) || '' };
  }
  return custom;
}

export function swapDelta(source, target) {
  const diff = target.market_value_lkr - source.market_value_lkr;
  if (Math.abs(diff) < 500000) return { label: '≈ Fair Trade', color: 'gold', diff };
  if (diff > 0) return { label: `+LKR ${diff.toLocaleString()}`, color: 'green', diff };
  return { label: `-LKR ${Math.abs(diff).toLocaleString()}`, color: 'red', diff };
}

export function getWinner(rowKey, v1, v2) {
  const rules = {
    mileage: (a, b) => a < b ? 'left' : b < a ? 'right' : 'tie',
    condition_grade: (a, b) => a > b ? 'left' : b > a ? 'right' : 'tie',
    market_value_lkr: (a, b) => 'tie',
    age: (a, b) => a < b ? 'left' : b < a ? 'right' : 'tie',
  };
  const fn = rules[rowKey];
  return fn ? fn(v1[rowKey], v2[rowKey]) : 'tie';
}

export function getServiceStatus(event, allEvents) {
  const services = allEvents.filter(e => e.phase === 'service').sort((a, b) => new Date(a.date) - new Date(b.date));
  const idx = services.findIndex(s => s.date === event.date && s.mileage === event.mileage);
  if (idx <= 0) return { status: 'on_time', label: '✅ On Time' };
  const prev = new Date(services[idx - 1].date);
  const curr = new Date(services[idx].date);
  const monthsDiff = (curr.getFullYear() - prev.getFullYear()) * 12 + curr.getMonth() - prev.getMonth();
  if (monthsDiff > 15) {
    const overdue = monthsDiff - 12;
    return { status: 'late', label: `⚠️ ${overdue} months overdue` };
  }
  return { status: 'on_time', label: '✅ On Time' };
}

export function calcDepreciationStats(vehicle) {
  const dep = vehicle.depreciation;
  const initial = dep[0].value;
  const current = dep[dep.length - 1].value;
  const totalLoss = initial - current;
  const totalPercent = ((totalLoss / initial) * 100).toFixed(1);
  const years = dep[dep.length - 1].year - dep[0].year;
  const annualAvg = Math.round(totalLoss / (years || 1));
  return { totalLoss, totalPercent, annualAvg, initial, current };
}

export function getOwnerCount(vehicle, country = 'sl') {
  return vehicle.timeline.filter(e => e.phase === 'ownership').length;
}

export function getAccidentCount(vehicle) {
  return vehicle.timeline.filter(e => e.phase === 'accident').length;
}

export function getPlateNumber(vehicle) {
  const reg = [...vehicle.timeline].reverse().find(e => e.phase === 'registration');
  if (!reg) return '';
  const match = reg.detail.match(/(?:Plate|Registration number|number plate):?\s*([A-Z\s\-\d]+)/i);
  return match ? match[1].trim() : '';
}
