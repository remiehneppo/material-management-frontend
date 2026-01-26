interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200 h-16 sm:h-20">
      <div className="h-full px-3 sm:px-4 lg:px-6 xl:px-8 flex items-center">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent uppercase tracking-wide flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-block w-1 h-6 sm:h-8 lg:h-10 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
            {title}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            
          </div>
        </div>
      </div>
    </header>
  );
}