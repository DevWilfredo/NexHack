import { Outlet, useLocation } from "react-router";
import {useAuth} from '@context/AuthContext'
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import ChatWidget from "../ChatbotWidget";

const Layout = () => {
  const {user}  = useAuth()
  const location = useLocation()
  const isLanding = location.pathname === '/'
  return (
    <div className="flex flex-col min-h-screen bg-base-300">
      <Navbar />

      <div className="flex flex-1">
        {user && !isLanding && <Sidebar />}

        <main className="flex-1 p-4 mt-4 overflow-auto">
          <Outlet />
          <ChatWidget />
        </main>
      </div>
    </div>
  );
};

export default Layout;
