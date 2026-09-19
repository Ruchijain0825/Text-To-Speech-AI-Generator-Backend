import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 ${darkMode ? "bg-gray-950 text-white" : "bg-white text-gray-900"}`}>
      <Sidebar darkMode={darkMode} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className={`min-h-0 flex-1 overflow-auto transition-colors duration-300 ${darkMode ? "bg-gray-950 text-white" : "bg-white text-gray-900"}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;