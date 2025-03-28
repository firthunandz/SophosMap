import { ClipLoader } from 'react-spinners';

export const LoadingButton = ({ loading, children, ...props }) => (
  <button 
    {...props} 
    disabled={loading}
    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-antique-gold hover:bg-antique-gold/80 ${
      loading ? 'opacity-75 cursor-not-allowed' : ''
    }`}
  >
    {loading ? (
      <ClipLoader size={20} color="#ffffff" className="my-1" />
    ) : (
      children
    )}
  </button>
);