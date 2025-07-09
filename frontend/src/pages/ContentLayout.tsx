import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const ContentLayout = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/home";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content wrapper */}
      <div className="flex flex-1">
        {/* Sidebar: sticky positioning */}
        {showSidebar && (
          <aside className="w-96 bg-white border-r sticky top-0 h-screen overflow-y-auto">
            <Sidebar />
          </aside>
        )}

        {/* Main content: natural scroll with page */}
        <div className="flex-1 bg-white">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ContentLayout;