// Phase color mapping for timeline events
export const PHASE_COLORS = {
  manufacture:  { color: '#4A9EFF', bg: 'rgba(74,158,255,0.12)',  label: 'Manufacturer' },
  first_sale:   { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',   label: 'Dealer' },
  service:      { color: '#FF8C42', bg: 'rgba(255,140,66,0.12)',  label: 'Service Center' },
  insurance:    { color: '#22D3EE', bg: 'rgba(34,211,238,0.12)',  label: 'Insurance' },
  accident:     { color: '#FF4545', bg: 'rgba(255,69,69,0.12)',   label: 'Accident Report' },
  export_sale:  { color: '#A855F7', bg: 'rgba(168,85,247,0.12)', label: 'Auction House' },
  export:       { color: '#A855F7', bg: 'rgba(168,85,247,0.12)', label: 'Exporter' },
  inspection:   { color: '#F5C842', bg: 'rgba(245,200,66,0.12)', label: 'JEVIC' },
  arrival:      { color: '#22D3EE', bg: 'rgba(34,211,238,0.12)', label: 'Port Authority' },
  customs:      { color: '#22D3EE', bg: 'rgba(34,211,238,0.12)', label: 'Customs' },
  registration: { color: '#00C875', bg: 'rgba(0,200,117,0.12)',  label: 'RMV' },
  ownership:    { color: '#F5C842', bg: 'rgba(245,200,66,0.12)', label: 'Owner' },
};

// Tab filter mappings
export const TAB_FILTERS = {
  timeline:     () => true,
  accident:     e => e.phase === 'accident',
  travel:       e => ['manufacture','export_sale','export','inspection','arrival','customs'].includes(e.phase),
  ownership:    e => ['first_sale','ownership'].includes(e.phase),
  service:      e => e.phase === 'service',
  registration: e => ['registration','customs'].includes(e.phase),
};

// Grade color mapping
export const GRADE_COLORS = {
  5: '#00C875',
  4: '#7BC67E',
  3: '#F5C842',
  2: '#FF8C42',
  1: '#FF4545',
};
