import { Outlet } from "react-router";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex justify-center p-4 mt-10">
        <div className="w-full max-w-full">{<Outlet />}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
