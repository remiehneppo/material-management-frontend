"use client";

import { useState, createContext, useContext } from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const SidebarContext = createContext({
  isCollapsed: false,
  setIsCollapsed: (collapsed: boolean) => {}
});

export const useSidebar = () => useContext(SidebarContext);

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}