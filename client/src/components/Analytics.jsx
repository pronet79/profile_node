import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api.js';

/*
  Fires a privacy-friendly pageview to the backend on each route change.
  - Admin routes are never tracked (keeps analytics about the public site).
  - Failures are swallowed; analytics must never disrupt the UX.
  - Referrer is only sent on the first load of the session.
*/
export default function Analytics() {
  const location = useLocation();
  const firstLoad = useRef(true);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    const payload = {
      path: location.pathname,
      referrer: firstLoad.current ? document.referrer || '' : '',
      type: 'pageview',
    };
    firstLoad.current = false;
    api.post('/analytics/track', payload).catch(() => {});
  }, [location.pathname]);

  return null;
}
