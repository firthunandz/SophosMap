import { Outlet } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';

export default function MainLayout({children}) {
  return (
    <div className="h-screen flex flex-col bg-papyrus overflow-hidden">
      <MainHeader />
      <main className="flex-1 overflow-y-auto w-full">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}