import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

const ContentLayout = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/home";

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]">
      <div className="flex flex-col md:flex-row flex-1">

        {/* Sidebar (Desktop) */}
        {showSidebar && (
          <aside
            className={`sticky top-20 self-start hidden md:block bg-white border-r h-[calc(100vh-5rem)] overflow-y-auto transition-all duration-300 ${
              sidebarOpen ? "md:w-80" : "md:w-0"
            }`}
          >
            {/* Hide button */}
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-2 z-10 px-2 py-1 text-sm rounded border bg-white hover:bg-slate-100"
              >
                ❮
              </button>
            )}

            {/* Sidebar content only when open */}
            {sidebarOpen && <Sidebar />}
          </aside>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0 bg-white transition-all duration-300">
          
          {/* Show button when sidebar is closed */}
          {showSidebar && !sidebarOpen && (
            <div className="hidden md:block px-4 pt-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="px-3 py-2 text-sm rounded border hover:bg-slate-100"
              >
                ☰ Show Topics
              </button>
            </div>
          )}

          <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ContentLayout;
