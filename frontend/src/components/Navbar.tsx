import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Modules", path: "/#modules" }, // Smooth scroll
    { name: "About", path: "/#about" },
    // { name: "Contributors", path: "/contributors" },
    { name: "Contact", path: "/Contact" },
  ];

  return (
    <header className="bg-[#bbdfff] fixed top-0 left-0 w-full shadow z-50">
      <div className="w-full max-w-7xl mx-auto flex items-center px-6 py-3">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <img src="/assets/logo.png" alt="EM Lab Logo" className="h-10 w-10" />
          <div className="leading-tight">
            <h1 className="text-lg font-bold text-red-700">
              Virtual Electromagnetics Laboratory
            </h1>
            <p className="text-xs text-gray-800">
              Indian Institute of Information Technology Sri City
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="ml-16 flex gap-10 text-sm font-medium text-gray-800">
          {navItems.map((item) =>
            item.path.includes("#") ? (
              <HashLink
                key={item.name}
                to={item.path}
                smooth
                className="hover:text-blue-700 transition duration-150"
              >
                {item.name}
              </HashLink>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`hover:text-blue-700 transition duration-150 ${
                  location.pathname === item.path ? "text-blue-700" : ""
                }`}
              >
                {item.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;