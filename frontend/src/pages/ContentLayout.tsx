// src/pages/ContentLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const ContentLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 p-6 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default ContentLayout;
