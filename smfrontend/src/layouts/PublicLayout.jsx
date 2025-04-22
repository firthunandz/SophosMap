import { Outlet } from "react-router-dom";
import PublicHeader from "../components/layouts/header/PublicHeader";
import Footer from "../components/layouts/footer/Footer";

export default function PublicLayout({ children }) {
 return (
  <div className="h-screen flex flex-col bg-papyrus overflow-hidden">
   <PublicHeader />
   <main className="flex flex-col flex-1 items-center overflow-y-auto w-full">
    {children || <Outlet />}
   </main>
   <Footer />
  </div>
 );
}
