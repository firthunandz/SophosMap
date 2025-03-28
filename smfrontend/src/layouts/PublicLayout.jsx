import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';

export default function PublicLayout({children}) {
  return (
    <div className="min-h-screen flex flex-col bg-papyrus">
      <PublicHeader />
      <div className="flex flex-col flex-1 items-center justify-center">
        {children || <Outlet />}
      </div>
      <Footer />
    </div>
  );
}