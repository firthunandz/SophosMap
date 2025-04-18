import { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [results, setResults] = useState([]);

  const toggleSearchBar = () => setVisible(prev => !prev);

  return (
    <SearchContext.Provider value={{ visible, toggleSearchBar, results, setResults }}>
      {children}
    </SearchContext.Provider>
  );
};
