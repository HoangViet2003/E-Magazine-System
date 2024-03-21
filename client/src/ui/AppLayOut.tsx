import Header from "../layout/header/Header";
import Sidebar from "../layout/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../layout/sidebar/SidebarContext";

export default function AppLayOut() {
  return (
    <SidebarProvider>
      <div className="grid grid-rows-[auto_1fr] border-borderColor font-BeVietnamPro">
        <Header />
        <div className="container grid grid-cols-[1fr] lg:grid-cols-[320px_1fr]">
          <Sidebar />

          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
