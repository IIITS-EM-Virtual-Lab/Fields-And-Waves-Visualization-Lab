import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/slices/authSlice";

const Navbar = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated); // ✅

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Modules", path: "/home/#modules" },
    { name: "About", path: "/home/#about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
   <header className="bg-[#bbdfff] fixed top-0 left-0 w-full shadow z-50">
  <div className="relative flex items-center px-6 py-4 w-full">
    {/* Logo section - left aligned */}
    <div className="flex items-center space-x-4">
      <img src="/assets/logo.png" alt="EM Lab Logo" className="h-12 w-12" />
      <div>
        <h1 className="text-xl font-bold text-red-700">
          Virtual Electromagnetics Laboratory
        </h1>
        <p className="text-sm text-gray-800">
          Indian Institute of Information Technology Sri City
        </p>
      </div>
    </div>

    {/* Centered Navigation Links */}
    <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-10 text-md font-medium text-gray-800">
      {navItems.map((item) =>
        isAuthenticated ? (
          <Link
            key={item.path}
            to={item.path}
            className={`hover:text-blue-700 transition ${
              location.pathname === item.path ? "text-blue-700" : ""
            }`}
          >
            {item.name}
          </Link>
        ) : (
          <span
            key={item.path}
            className="text-gray-400 cursor-not-allowed"
            title="Login to access"
          >
            {item.name}
          </span>
        )
      )}
    </nav>
  </div>
</header>

  );
};

export default Navbar;
