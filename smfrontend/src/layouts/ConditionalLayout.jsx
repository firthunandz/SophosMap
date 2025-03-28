import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import PublicLayout from './PublicLayout';
import MainLayout from './MainLayout';

const ConditionalLayout = ({ children }) => {
  // const [layoutVersion, setLayoutVersion] = useState(0);
  const { isAuthenticated } = useAuth();

  // useEffect(() => {
  //   const handler = () => setLayoutVersion(v => v + 1);
  //   window.addEventListener('authChange', handler);
  //   return () => window.removeEventListener('authChange', handler);
  // }, []);

  return isAuthenticated ? (
    <MainLayout>{children}</MainLayout>
  ) : (
    <PublicLayout>{children}</PublicLayout>
  );
};

export default ConditionalLayout;