"use client";

import { useState, createContext, useContext, useEffect } from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const SidebarContext = createContext({
  isCollapsed: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsCollapsed: (_collapsed: boolean) => {}
});

export const useSidebar = () => useContext(SidebarContext);

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-16 sm:ml-20" : "ml-56 sm:ml-64 xl:ml-72"
          }`}
        >
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}