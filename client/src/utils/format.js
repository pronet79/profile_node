export const inr = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

export const monthYear = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : 'Present';
