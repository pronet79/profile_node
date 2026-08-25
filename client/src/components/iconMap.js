import {
  LayoutGrid, Building2, ShoppingBag, Sparkles, Radio, Plug, Code, Cpu, Database, Cloud,
} from 'lucide-react';

export const iconMap = {
  'layout-grid': LayoutGrid,
  'building-2': Building2,
  'shopping-bag': ShoppingBag,
  sparkles: Sparkles,
  radio: Radio,
  plug: Plug,
  code: Code,
  cpu: Cpu,
  database: Database,
  cloud: Cloud,
};

export const getIcon = (name) => iconMap[name] || Code;
