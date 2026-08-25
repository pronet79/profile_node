import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

/* Fetches public site settings once and shares them across the public site
   (Hero, Footer, About, Contact). Falls back to sensible defaults so the UI
   always renders, even before the API responds or the DB is seeded. */
const DEFAULTS = {
  name: 'Pradosh Mukherjee',
  role: 'Senior Full-Stack Developer',
  location: 'Kolkata, India',
  email: '',
  bio: '',
  profilePhoto: '',
  resumeUrl: '',
  heroHeading: '',
  social: { github: '', linkedin: '', fiverr: '' },
};

const SettingsContext = createContext(DEFAULTS);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    let active = true;
    api.get('/settings')
      .then((res) => { if (active && res.data?.data) setSettings({ ...DEFAULTS, ...res.data.data, social: { ...DEFAULTS.social, ...(res.data.data.social || {}) } }); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
