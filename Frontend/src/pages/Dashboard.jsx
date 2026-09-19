import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import socket from "../socket";

const Dashboard = () => {

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return;

  const user = JSON.parse(storedUser);

  const handleConnect = () => {
    console.log("Socket connected:", socket.id);

    socket.emit("user_online", String(user.id));
  };

  socket.on("connect", handleConnect);

  if (!socket.connected) {
    socket.connect();
  }

  return () => {
    socket.off("connect", handleConnect);
  };
}, []);

  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Header />

        <main>
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default Dashboard;