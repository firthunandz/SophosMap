import { Outlet } from "react-router-dom";
import MainHeader from "../components/layouts/header/MainHeader";
import Footer from "../components/layouts/footer/Footer";

export default function MainLayout({ children }) {
 return (
  <div className="h-screen flex flex-col bg-papyrus overflow-hidden">
   <MainHeader />
   <main className="flex flex-col flex-1 items-center overflow-y-auto w-full">
    {children || <Outlet />}
   </main>
   <Footer />
  </div>
 );
}
