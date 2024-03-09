import React from "react";
import Header from "../layout/header/Header";
import Sidebar from "../layout/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayOut() {
  return (
    <div className="border-borderColor grid h-screen grid-rows-[auto_1fr] border-b">
      <Header />
      <div className="container grid grid-cols-[320px_1fr]">
        <Sidebar />

        <Outlet />
      </div>
    </div>
  );
}
