import { useState } from 'react';
import { Star } from 'lucide-react';

export function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          aria-checked={value === n}
          role="radio"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="p-0.5"
        >
          <Star className={`h-6 w-6 transition-colors ${(hover || value) >= n ? 'fill-accent text-accent' : 'text-slate-600'}`} />
        </button>
      ))}
    </div>
  );
}

export function StarDisplay({ value }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-4 w-4 ${value >= n ? 'fill-accent text-accent' : 'text-slate-600'}`} />
      ))}
    </div>
  );
}
