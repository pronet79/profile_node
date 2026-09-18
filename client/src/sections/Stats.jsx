import { useCountUp } from '../hooks/useCountUp.js';
import { useSettings } from '../context/SettingsContext.jsx';

const DEFAULT_STATS = [
  { value: '12', suffix: '+', label: 'Years Experience' },
  { value: '50', suffix: '+', label: 'Successful Projects Shipped' },
  { value: '25', suffix: '+', label: 'Technologies & Tools' },
  { value: '6', suffix: '+', label: 'Business Domains' },
];

function Stat({ value, suffix, label }) {
  const numeric = parseInt(value, 10);
  const isNumeric = !Number.isNaN(numeric);
  const { ref, value: counted } = useCountUp(isNumeric ? numeric : 0);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {isNumeric ? counted : value}
        {suffix ? <span className="text-accent">{suffix}</span> : null}
      </div>
      <div className="mt-2 text-sm text-slate-400">{label}</div>
    </div>
  );
}

// Explicit classes so Tailwind's purge keeps them (no dynamic string building).
const GRID_COLS = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };

export default function Stats() {
  const s = useSettings();
  const stats = (Array.isArray(s.stats) && s.stats.length ? s.stats : DEFAULT_STATS).slice(0, 4);
  const cols = GRID_COLS[Math.min(stats.length, 4)] || 'md:grid-cols-4';

  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-14">
      <div className={`container-x grid grid-cols-2 gap-8 ${cols}`}>
        {stats.map((st, i) => <Stat key={i} {...st} />)}
      </div>
    </section>
  );
}
