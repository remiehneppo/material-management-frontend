"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CubeIcon, 
  DocumentCheckIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/AuthProvider";

const navigation = [
  { name: "Tổng quan", href: "/", icon: HomeIcon },
  { name: "Dự án", href: "/projects", icon: DocumentTextIcon },
  { name: "Vật tư", href: "/materials", icon: CubeIcon },
  { name: "Yêu cầu vật tư", href: "/requests", icon: DocumentCheckIcon },
  { name: "Thông tin", href: "/profile", icon: UserIcon },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await logout();
    }
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-cyan-500 via-cyan-400 to-blue-500 transition-all duration-300 ease-in-out shadow-2xl flex flex-col ${
        isCollapsed ? "w-20" : "w-64 xl:w-72"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-3 z-10 w-7 h-7 bg-white rounded-full shadow-xl flex items-center justify-center text-cyan-600 hover:bg-cyan-50 hover:scale-110 transition-all duration-200 border-2 border-cyan-100"
        title={isCollapsed ? "Mở rộng" : "Thu nhỏ"}
        aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu nhỏ sidebar"}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-4 h-4" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4" />
        )}
      </button>

      {/* Logo Section */}
      <div className="flex-shrink-0 flex items-center justify-center h-20 px-4 border-b border-white/20 backdrop-blur-sm bg-white/10">
        <div className="flex items-center space-x-2">
          {isCollapsed ? (
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <span className="text-cyan-600 font-bold text-lg">VT</span>
            </div>
          ) : (
            <div className="transform hover:scale-105 transition-transform">
              <Image 
                src="/logo.png" 
                alt="Logo Quản lý vật tư" 
                width={120}
                height={48}
                className="h-16 w-auto object-contain drop-shadow-lg"
                priority
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    group flex items-center ${isCollapsed ? "justify-center px-3" : "space-x-3 px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-cyan-600 shadow-lg scale-105"
                        : "text-white hover:bg-white/20 hover:text-white hover:shadow-md hover:scale-[1.02]"
                    }
                  `}
                  title={isCollapsed ? item.name : ""}
                >
                  <item.icon className={`flex-shrink-0 transition-transform ${isCollapsed ? "w-6 h-6" : "w-5 h-5"} ${!isActive && "group-hover:scale-110"}`} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                  {!isCollapsed && isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="flex-shrink-0 pb-3">
        {/* Logout Button */}
        <div className="px-3 mb-2">
          <button
            onClick={handleLogout}
            className={`w-full group flex items-center ${isCollapsed ? "justify-center px-3" : "space-x-3 px-4"} py-3 rounded-xl text-sm font-semibold text-white hover:bg-white/20 hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
            title={isCollapsed ? "Đăng xuất" : ""}
          >
            <ArrowRightOnRectangleIcon className={`flex-shrink-0 transition-transform ${isCollapsed ? "w-6 h-6" : "w-5 h-5"} group-hover:scale-110`} />
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="px-5 py-2 border-t border-white/20 backdrop-blur-sm bg-white/10">
            <div className="text-white text-xs font-medium opacity-90 hover:opacity-100 transition-opacity text-center">
              kt-cn.x52.com
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}