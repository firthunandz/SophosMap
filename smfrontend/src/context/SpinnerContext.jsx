import { createContext, useState, useContext, useRef } from 'react';

const SpinnerContext = createContext();

export const SpinnerProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const activeSpinners = useRef(0); // Contador de spinners activos

  const showSpinner = () => {
    activeSpinners.current += 1;
    if (activeSpinners.current === 1) {
      setLoading(true);
      console.log('[SpinnerContext] Mostrando spinner, activeSpinners:', activeSpinners.current);
    }
  };

  const hideSpinner = () => {
    activeSpinners.current = Math.max(0, activeSpinners.current - 1);
    if (activeSpinners.current === 0) {
      setLoading(false);
      console.log('[SpinnerContext] Ocultando spinner, activeSpinners:', activeSpinners.current);
    }
  };

  return (
    <SpinnerContext.Provider value={{ showSpinner, hideSpinner, loading }}>
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinner = () => useContext(SpinnerContext);