export default function Navbar() {
  return (
    <header className="w-full h-16 bg-white border-b shadow-sm flex items-center justify-between px-8">
      <div className="font-bold text-xl tracking-tight text-blue-700 flex items-center gap-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-blue-500"><rect width="24" height="24" rx="6" fill="#3B82F6"/><path d="M7 17V7h10v10H7z" fill="#fff"/></svg>
        Inventory System
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-600 font-medium">Admin</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-500 font-bold">A</span>
      </div>
    </header>
  );
} 