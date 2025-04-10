import { createContext, useState, useContext, useRef } from 'react';

const SpinnerContext = createContext();

export const SpinnerProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const spinnerTimeout = useRef(null);
  
  const showSpinner = () => {
    spinnerTimeout.current = setTimeout(() => setLoading(true), 200);
  };
  const hideSpinner = () => {
    clearTimeout(spinnerTimeout.current);
    setLoading(false);
  };
  
  return (
    <SpinnerContext.Provider value={{ showSpinner, hideSpinner, loading }}>
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinner = () => useContext(SpinnerContext);