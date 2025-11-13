"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CubeIcon, 
  DocumentCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  UserIcon,
  CogIcon,
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
  // { name: "Báo cáo", href: "/reports", icon: ChartBarIcon },
  // { name: "Tạo nhóm", href: "/groups", icon: UserGroupIcon },
  { name: "Thông tin", href: "/profile", icon: UserIcon },
  // { name: "Thiết lập", href: "/settings", icon: CogIcon },
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
    <div className={`fixed inset-y-0 left-0 z-50 bg-cyan-400 overflow-y-auto transition-all duration-300 ${
      isCollapsed ? "w-20" : "w-64"
    }`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-3 z-10 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-cyan-600 hover:bg-cyan-50 transition-colors"
        title={isCollapsed ? "Mở rộng" : "Thu nhỏ"}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-4 h-4" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4" />
        )}
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center h-24 px-4 border-b border-cyan-300">
        <div className="flex items-center space-x-2">
          {isCollapsed ? (
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-cyan-600 font-bold text-lg">VT</span>
            </div>
          ) : (
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={120}
              height={48}
              className="h-20 w-auto object-contain"
              priority
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center ${isCollapsed ? "justify-center" : "space-x-3"} px-3 py-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-white text-cyan-600 shadow-sm"
                        : "text-white hover:bg-cyan-300 hover:text-cyan-800"
                    }
                  `}
                  title={isCollapsed ? item.name : ""}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-16 left-4 right-4">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? "justify-center" : "space-x-3"} px-3 py-3 rounded-lg text-sm font-medium text-white hover:bg-cyan-300 hover:text-cyan-800 transition-colors`}
          title={isCollapsed ? "Đăng xuất" : ""}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>

      {/* Footer Link */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-white text-xs opacity-75">
            https://kt-cn.x52.com
          </div>
        </div>
      )}
    </div>
  );
}