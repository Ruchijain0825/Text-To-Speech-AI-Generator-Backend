import { useState } from "react";
import HelpModal from "./HelpModal.jsx";
import AccountModal from "./AccountModal.jsx";
import socket from "../socket.js";

const Header = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showBlack, setShowBlack] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  const userName = user?.name || user?.username || "User";
  const userEmail = user?.email || "No email";
  const userInitial = userName.charAt(0).toUpperCase();

  const toggleTheme = () => {
    setShowBlack(!showBlack);
    document.body.style.backgroundColor = !showBlack ? "white" : "black";
  };

  const handleLogout = () => {
    socket.disconnect();
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <>
      <header className="h-16 w-full border-b border-gray-100 bg-white px-6 shadow-lg">
        <div className="flex h-full items-center justify-end gap-6">

          <button onClick={toggleTheme} type="button" className="text-gray-200 transition hover:text-gray-800">☾</button>

          <button onClick={() => { setShowHelp(true); setShowAccountDetails(false); }} type="button" className="text-gray-500 transition hover:text-gray-800">Help</button>

          <button onClick={() => { setShowAccountDetails(true); setShowHelp(false); }} type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">{userInitial}</button>

         

        </div>
      </header>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showAccountDetails && <AccountModal user={user} onLogout={handleLogout} onClose={() => setShowAccountDetails(false)} />}
    </>
  );
};

export default Header;