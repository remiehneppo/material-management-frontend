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
  ArrowRightOnRectangleIcon
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

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await logout();
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-cyan-400 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-center h-24 px-4 border-b border-cyan-300">
        <div className="flex items-center space-x-2">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={120}
            height={48}
            className="h-20 w-auto object-contain"
            priority
          />
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
                    flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-white text-cyan-600 shadow-sm"
                        : "text-white hover:bg-cyan-300 hover:text-cyan-800"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
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
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-white hover:bg-cyan-300 hover:text-cyan-800 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* Footer Link */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-white text-xs opacity-75">
          https://kt-cn.x52.com
        </div>
      </div>
    </div>
  );
}