import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils';
import { ROUTES } from '../../constants';
import { 
  LayoutDashboard, 
  Package, 
  Calculator, 
  TrendingUp,
  FileText,
  Settings,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: 'Quản lý vật tư',
    href: ROUTES.MATERIALS,
    icon: Package,
    children: [
      { name: 'Danh sách vật tư', href: ROUTES.MATERIALS },
      { name: 'Thêm vật tư', href: ROUTES.MATERIALS_CREATE },
      { name: 'Danh mục', href: ROUTES.CATEGORIES },
    ],
  },
  {
    name: 'Dự toán vật tư',
    href: ROUTES.BUDGET,
    icon: Calculator,
    children: [
      { name: 'Dự án', href: ROUTES.BUDGET_PROJECTS },
      { name: 'Vật tư dự toán', href: ROUTES.BUDGET_MATERIALS },
    ],
  },
  {
    name: 'Xuất vật tư',
    href: ROUTES.OUTPUT,
    icon: TrendingUp,
    children: [
      { name: 'Yêu cầu xuất', href: ROUTES.OUTPUT_REQUESTS },
      { name: 'Lịch sử xuất', href: ROUTES.OUTPUT_HISTORY },
    ],
  },
  {
    name: 'Báo cáo',
    href: ROUTES.REPORTS,
    icon: FileText,
    children: [
      { name: 'Báo cáo dự toán', href: ROUTES.REPORTS_BUDGET },
      { name: 'Báo cáo xuất', href: ROUTES.REPORTS_OUTPUT },
    ],
  },
  {
    name: 'Cài đặt',
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const toggleExpanded = (href: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(href)) {
      newExpanded.delete(href);
    } else {
      newExpanded.add(href);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          Quản lý vật tư
        </h1>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.has(item.href);
          const isItemActive = isActive(item.href);

          return (
            <div key={item.href}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(item.href)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isItemActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <div className="flex items-center">
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  <svg
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded ? 'rotate-90' : ''
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isItemActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )}

              {hasChildren && isExpanded && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className={cn(
                        'block px-3 py-2 text-sm rounded-md transition-colors',
                        isActive(child.href)
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {sidebarContent}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn('hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200', className)}>
        {sidebarContent}
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-10 p-2 bg-white rounded-md shadow-md lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
};

export default Sidebar;
