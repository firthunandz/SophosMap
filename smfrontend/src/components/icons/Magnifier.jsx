import { useContext } from 'react';
import { SearchContext } from '../../context/SearchContext';

const Magnifier = () => {
  const { toggleSearchBar } = useContext(SearchContext);

  return (
    <button onClick={toggleSearchBar} className="p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <path d="M21 21l-6 -6" />
      </svg> 
    </button>
  );
};

export default Magnifier;

