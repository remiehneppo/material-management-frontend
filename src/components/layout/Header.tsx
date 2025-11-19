interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200">
      <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent uppercase tracking-wide flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-block w-1 h-6 sm:h-8 lg:h-10 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
            {title}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700">Đang hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}