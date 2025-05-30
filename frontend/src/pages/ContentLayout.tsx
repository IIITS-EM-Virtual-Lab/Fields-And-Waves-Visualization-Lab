import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const ContentLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-grow pt-0 p-6 ml-60 bg-[#bbdfff]">
          <Outlet />
        </main>
       
      </div>
    </div>
  );
};

export default ContentLayout;