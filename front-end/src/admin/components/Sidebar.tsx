import { Link, useLocation } from "react-router-dom";
import { BarChart, BookOpen, ClipboardList, Settings } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <BarChart size={18} /> },
    { name: "Student Trends", path: "/admin/trends", icon: <ClipboardList size={18} /> },
    { name: "Resource Manager", path: "/admin/resources", icon: <BookOpen size={18} /> },
    { name: "Reports", path: "/admin/reports", icon: <ClipboardList size={18} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen p-4 shadow-lg">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              location.pathname === item.path
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
