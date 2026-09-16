import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import socket from "../socket";

const Dashboard = () => {

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    console.log("No user found");
    return;
  }

  const user = JSON.parse(storedUser);

  console.log("Logged in user:", user);

  socket.connect();

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);

    socket.emit("user_online", user.id);

    console.log("📡 user_online emitted:", user.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", reason);
  });

  return () => {
    socket.off("connect");
    socket.off("connect_error");
    socket.off("disconnect");
    socket.disconnect();
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