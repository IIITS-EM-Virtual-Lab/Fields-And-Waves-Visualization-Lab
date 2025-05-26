import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const ContentLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-grow p-6 ml-60">
          <Outlet />
        </main>
       
      </div>
    </div>
  );
};

export default ContentLayout;
