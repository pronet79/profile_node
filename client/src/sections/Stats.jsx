import { useCountUp } from '../hooks/useCountUp.js';

const stats = [
  { end: 10, suffix: '+', label: 'Years Experience' },
  { end: 150, suffix: '+', label: 'Successful Projects Shipped' },
  { end: 50, suffix: '+', label: 'Happy Clients' },
  { end: 100, suffix: '%', label: 'On-time Delivery' },
];

function Stat({ end, suffix, label }) {
  const { ref, value } = useCountUp(end);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {value}
        <span className="text-accent">{suffix}</span>
      </div>
      <div className="mt-2 text-sm text-slate-400">{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-14">
      <div className="container-x grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((s) => <Stat key={s.label} {...s} />)}
      </div>
    </section>
  );
}
