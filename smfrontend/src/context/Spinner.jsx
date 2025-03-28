import { ClipLoader } from 'react-spinners';
import { useSpinner } from './SpinnerContext';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

export const Spinner = () => {
  const { loading } = useSpinner();
  
  if (!loading) return null;
  
  return (
    <div style={overlayStyle}>
      <ClipLoader 
        color="#36d7b7" 
        size={50} 
        speedMultiplier={1} 
      />
    </div>
  );
};