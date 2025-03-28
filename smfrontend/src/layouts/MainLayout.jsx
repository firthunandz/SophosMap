import { Outlet } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';

export default function MainLayout({children}) {
  return (
    <div className="min-h-screen flex flex-col bg-papyrus">
      <MainHeader />
      <main className="flex-1 p-4">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}