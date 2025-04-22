import { ClipLoader } from 'react-spinners';
import clsx from 'clsx';

const variants = {
  gold: 'bg-antique-gold hover:bg-antique-gold/80 text-white',
  brown: 'bg-warm-brown hover:bg-warm-brown/80 text-white',
  gray: 'bg-warm-gray hover:bg-warm-gray/80 text-white',
  sepia: 'bg-deep-sepia hover:bg-deep-sepia/80 text-white'
};

export const LoadingButton = ({ loading, variant = 'gold', children, className = '', ...props }) => (
  <button 
    {...props} 
    disabled={loading}
    className={clsx(
      'w-full flex justify-center py-2 px-4 rounded-md shadow-sm font-medium transition',
      variants[variant],
      loading && 'opacity-75 cursor-not-allowed',
      className
    )}
  >
    {loading ? (
      <ClipLoader size={20} color="#ffffff" className="my-1" />
    ) : (
      children
    )}
  </button>
);
