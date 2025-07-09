import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  logout,
} from "@/store/slices/authSlice";
import { ChevronDown, Search } from "lucide-react";

const exploreModules = [
  {
    title: "Vector Algebra",
    items: [
      { name: "Scalars", path: "/scalars-and-vectors" },
      { name: "Addition", path: "/vector-addition" },
      { name: "Multiplication", path: "/vector-multiplication" },
      { name: "Triple Product", path: "/triple-product" },
    ],
  },
  {
    title: "Vector Calculus",
    items: [
      { name: "Intro", path: "/vector-calculus-intro" },
      { name: "Cylindrical Coordinates", path: "/cylindrical-coordinates" },
      { name: "Spherical Coordinates", path: "/spherical-coordinates" },
      { name: "Del Operator", path: "/del-operator" },
      { name: "Cartesian, Cylindrical and Spherical", path: "/cartesian-cylindrical-spherical"}
    ],
  },
  {
    title: "Electrostatics",
    items: [
      { name: "Intro", path: "/electrostatics-intro" },
      { name: "Electric Field & Flux", path: "/electric-field-and-flux-density" },
      { name: "Field Operations", path: "/field-operations" },
      { name: "Electric Potential", path: "/electric-potential" },
      { name: "Gauss Law", path: "/gauss-law" },
      { name: "Electric Dipole", path: "/electric-dipole" },
    ],
  },
  {
    title: "Maxwell Equations",
    items: [
      { name: "Gauss Law Contd", path: "/gauss-law-contd" },
      { name: "Gauss Law Magnetism", path: "/gauss-law-magnetism" },
      { name: "Faraday Law", path: "/faraday-law" },
      { name: "Ampere Law", path: "/ampere-law" },
      { name: "Displacement Current", path: "/displacement-current" },
      { name: "Time Varying Potential", path: "/time-varying-potential" },
      { name: "EMF", path: "/transformer-motional-emf" },
    ],
  },
  // {
  //   title: "Wave Propagation",
  //   items: [
  //     { name: "Types of Waves", path: "/types-of-waves" },
  //     { name: "Wave Power Energy", path: "/wave-power-energy" },
  //     { name: "Plane Wave Analysis", path: "/plane-wave-analysis" },
  //     { name: "Wave Reflection", path: "/wave-reflection" },
  //   ],
  // },
];

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const [showExplore, setShowExplore] = useState(false);
  const dropdownRef = useRef(null);

  // Debug logging
  console.log('Navbar - isAuthenticated:', isAuthenticated);
  console.log('Navbar - user:', user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowExplore(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white fixed top-0 left-0 w-full z-50 border-b border-gray-200 font-sans">
      <div className="max-w-[1200px] mx-auto h-[72px] flex items-center justify-between px-5 text-[18px] text-[#1a1a1a]">
        {/* Left Section */}
        <div className="flex items-center gap-6 relative">
          {/* Explore Dropdown */}
          <div ref={dropdownRef}>
            <button
              className="text-[#2563eb] font-semibold text-[18px] flex items-center gap-1 hover:underline"
              onClick={() => setShowExplore((prev) => !prev)}
            >
              Explore <ChevronDown size={16} />
            </button>

            {showExplore && (
              <div className="absolute top-[48px] left-0 w-[810px] bg-white border border-gray-200 shadow-xl p-6 flex gap-12 text-sm z-50">
                {exploreModules.map((mod, i) => (
                  <div key={i}>
                    <h4 className="text-[#1a1a1a] font-semibold mb-2 text-[16px] leading-[1.2]">{mod.title}</h4>
                    <ul className="space-y-1">
                      {mod.items.map((sub, j) => (
                        <li
                          key={j}
                          className="text-[#2563eb] text-[14px] hover:underline cursor-pointer"
                          onClick={() => {
                            navigate(sub.path);
                            setShowExplore(false);
                          }}
                        >
                          {sub.name}
                        </li>
                      ))}
                      </ul>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center border border-[#0f172a] rounded px-3 py-1.5">
            <Search size={18} className="text-[#2563eb] mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none text-[16px] text-[#2563eb] bg-transparent w-36 font-medium"
            />
          </div>
        </div>

        {/* Center Logo */}
            <div
              className="flex items-center gap-2 ml-[-80px] cursor-pointer"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/");
                } else if (user?.isAdmin === true) {
                  navigate("/profilepage");
                } else {
                  navigate("/userdashboard");
                }
              }}
            >
              <img src="/logo.png" alt="Logo" className="h-6 w-6" />
              <h1 className="text-[#a00032] font-lato font-bold text-[20px]">
                Fields and Waves Visualization Lab
              </h1>
            </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 text-[16px] font-semibold">
          {!isAuthenticated ? (
            <>
              <button onClick={() => navigate("/login")} className="text-[#2563eb] hover:underline">
                Log in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-1.5 rounded text-[16px]"
              >
                Sign up
              </button>
            </>
          ) : (
            user && (
              <>
                <button
                  onClick={() => {
                    if (user?.isAdmin === true) {
                      navigate("/profilepage");
                    } else {
                      navigate("/userdashboard");
                    }
                  }}
                  className="px-4 py-1 bg-gray-100 rounded-full text-[#1a1a1a] font-medium"
                >
                  {user.name}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm"
                >
                  Sign Out
                </button>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
