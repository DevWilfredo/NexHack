import { Outlet } from "react-router";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-base-300">
      <Navbar />
      <main className="flex-1 flex justify-center p-4 mt-10">
        <div className="w-full max-w-full">{<Outlet />}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
