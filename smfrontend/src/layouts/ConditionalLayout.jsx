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