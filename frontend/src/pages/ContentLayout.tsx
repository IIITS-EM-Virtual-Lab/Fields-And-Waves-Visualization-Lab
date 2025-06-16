import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const ContentLayout = () => {
  const location = useLocation();

  // You can adjust this to match multiple paths if needed
  const showSidebar = location.pathname !== "/home";

  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar />}
      <div className="flex flex-col flex-1">
        <main className={`flex-grow pt-0 p-6 ${showSidebar ? "ml-60" : ""} bg-[#ffffff]`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default ContentLayout;