import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed top-0 w-full z-50 opacity-75">
        <Navbar />
      </div>

      <main className="">
        <Outlet />
      </main> 
      <Footer />
    </div>
  );
};

export default Layout;