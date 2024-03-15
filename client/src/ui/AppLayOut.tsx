import Header from "../layout/header/Header";
import Sidebar from "../layout/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayOut() {
  return (
    <div className="grid grid-rows-[auto_1fr] border-b border-borderColor font-BeVietnamPro">
      <Header />
      <div className="container grid grid-cols-[320px_1fr]">
        <Sidebar />

        <Outlet />
      </div>
    </div>
  );
}
