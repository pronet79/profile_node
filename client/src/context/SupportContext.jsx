import { createContext, useContext, useState, useCallback } from 'react';

const SupportContext = createContext({ open: false, openSupport: () => {}, closeSupport: () => {} });

export function SupportProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openSupport = useCallback(() => setOpen(true), []);
  const closeSupport = useCallback(() => setOpen(false), []);
  return (
    <SupportContext.Provider value={{ open, openSupport, closeSupport }}>
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  return useContext(SupportContext);
}
