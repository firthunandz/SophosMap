// import { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import PublicLayout from './PublicLayout';
import MainLayout from './MainLayout';

const ConditionalLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? (
    <MainLayout>{children}</MainLayout>
  ) : (
    <PublicLayout>{children}</PublicLayout>
  );
};

export default ConditionalLayout;

// const [layoutVersion, setLayoutVersion] = useState(0);

// useEffect(() => {
//   const handler = () => setLayoutVersion(v => v + 1);
//   window.addEventListener('authChange', handler);
//   return () => window.removeEventListener('authChange', handler);
// }, []);