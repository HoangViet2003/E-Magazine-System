import Header from "../layout/header/Header";
import Sidebar from "../layout/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../layout/sidebar/SidebarContext";
import { useAuth } from "../redux/hooks/useAuth";
import SidebarStudent from "../layout/sidebar/SidebarStudent";

export default function AppLayOut() {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="grid grid-rows-[auto_1fr] border-borderColor font-BeVietnamPro">
        <Header />
        <div className="container grid grid-cols-[1fr] xl:grid-cols-[300px_1fr]">
          {user.role === "student" && <SidebarStudent />}
          {user.role === "marketing coordinator" && <Sidebar />}

          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
