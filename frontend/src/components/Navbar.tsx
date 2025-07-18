import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  logout,
} from "@/store/slices/authSlice";
import { ChevronDown, Search, User, Settings, LogOut } from "lucide-react";

const exploreModules = [
  {
    title: "Vector Algebra",
    items: [
      { name: "Scalars and Vectors", path: "/scalars-and-vectors" },
      { name: "Addition", path: "/vector-addition" },
      { name: "Multiplication", path: "/vector-multiplication" },
      { name: "Triple Product", path: "/triple-product" },
    ],
  },
  {
    title: "Vector Calculus",
    items: [
      { name: "Cylindrical Coordinates", path: "/cylindrical-coordinates" },
      { name: "Spherical Coordinates", path: "/spherical-coordinates" },
      { name: "Cartesian, Cylindrical and Spherical", path: "/cartesian-cylindrical-spherical"},
      { name: "Differential Length, Area and Volume", path: "/vector-calculus-intro" },
      { name: "Del Operator", path: "/del-operator" }
    ],
  },
  {
    title: "Electrostatics",
    items: [
      { name: "Intro", path: "/electrostatics-intro" },
      { name: "Electric Field & Flux", path: "/electric-field-and-flux-density" },
      // { name: "Field Operations", path: "/field-operations" },
      { name: "Electric Potential", path: "/electric-potential" },
      // { name: "Gauss Law", path: "/gauss-law" },
      { name: "Electric Dipole", path: "/electric-dipole" },
    ],
  },
  {
    title: "Maxwell Equations",
    items: [
      { name: "Gauss Law", path: "/gauss-law-contd" },
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
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{name: string, path: string, module: string}>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Debug logging
  console.log('Navbar - isAuthenticated:', isAuthenticated);
  console.log('Navbar - user:', user);

  // Create a flattened array of all items for searching
  const allItems = exploreModules.flatMap(module => 
    module.items.map(item => ({
      ...item,
      module: module.title
    }))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowExplore(false);
      }
      if (
        userDropdownRef.current &&
        !(userDropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        searchRef.current &&
        !(searchRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filteredResults = allItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.module.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults);
    setShowSearchResults(true);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchQuery);
    }
  };

  const handleSearchResultClick = (path: string) => {
    navigate(path);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setShowUserDropdown(false);
  };

  const handleUserDashboard = () => {
    if (user?.isAdmin === true) {
      navigate("/profilepage");
    } else {
      navigate("/userdashboard");
    }
    setShowUserDropdown(false);
  };

  const handleSettings = () => {
    navigate("/settings");
    setShowUserDropdown(false);
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
                    <h4
                      className="text-[#1a1a1a] font-semibold mb-2 text-[16px] leading-[1.2] cursor-pointer hover:underline"
                      onClick={() => {
                        navigate(`/module/${mod.title.toLowerCase().replace(/\s+/g, "-")}`);
                        setShowExplore(false);
                      }}
                    >
                      {mod.title}
                    </h4>
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
          <div ref={searchRef} className="hidden md:flex items-center border border-[#0f172a] rounded px-3 py-1.5 relative">
            <Search size={18} className="text-[#2563eb] mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="outline-none text-[16px] text-[#2563eb] bg-transparent w-36 font-medium"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-[45px] left-0 w-[300px] bg-white border border-gray-200 shadow-xl max-h-[400px] overflow-y-auto z-50">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSearchResultClick(result.path)}
                  >
                    <div className="text-[#2563eb] text-[14px] font-medium hover:underline">
                      {result.name}
                    </div>
                    <div className="text-[#666] text-[12px] mt-1">
                      {result.module}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No Results Message */}
            {showSearchResults && searchResults.length === 0 && searchQuery.trim() !== "" && (
              <div className="absolute top-[45px] left-0 w-[300px] bg-white border border-gray-200 shadow-xl z-50">
                <div className="px-4 py-3 text-[#666] text-[14px]">
                  No results found for "{searchQuery}"
                </div>
              </div>
            )}
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
              <img src="/fwvlab.png" alt="Logo" className="h-9 w-9" />
              <h1 className="text-[#a00032] font-lato font-bold text-[18px]">
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
              <div ref={userDropdownRef} className="relative">
                <button
                  onClick={() => setShowUserDropdown((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-1 font-medium transition-colors"
                >
                  <div className="w-6 h-6 bg-[#2563eb] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex items-center gap-1 text-[#2563eb] font-semibold text-[17px]">
                    <span>{user.name}</span>
                    <ChevronDown size={14} />
                  </div>
                </button>


                {showUserDropdown && (
                  <div className="absolute top-[45px] right-0 w-48 bg-white border border-gray-200 shadow-xl rounded-lg py-1 z-50"> 
                    <button
                      onClick={handleUserDashboard}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} />
                      {user?.isAdmin === true ? "Dashboard" : "Dashboard"}
                    </button>
                    
                    <button
                      onClick={handleSettings}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;