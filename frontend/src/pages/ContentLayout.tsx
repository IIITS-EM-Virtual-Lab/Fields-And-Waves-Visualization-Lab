import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const ContentLayout = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/home";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main layout wrapper */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar: Hidden on mobile */}
        {showSidebar && (
          <aside className="hidden md:block md:w-80 bg-white border-r h-screen overflow-y-auto">
            <Sidebar />
          </aside>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ContentLayout;
