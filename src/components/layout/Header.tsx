export default function Header({ title }: { title: string }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-semibold text-cyan-500 uppercase tracking-wide">
          {title}
        </h1>
      </div>
    </header>
  );
}