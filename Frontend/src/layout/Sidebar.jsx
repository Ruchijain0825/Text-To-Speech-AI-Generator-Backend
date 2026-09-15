import { logo, robot } from "../assets/assests.js";

import {
  Bot,
  Volume2,
  Settings,
  Bookmark,
  History,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="bg-white w-64 min-h-screen shadow-lg">

      {/* Logo */}
      <header>
        <img
          src={logo}
          width="90px"
          className="text-lg"
          alt="logo"
        />
      </header>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4 text-sm">

        {/* Text to Speech */}
        <a
          href="#"
          className="shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900"
        >
          <Volume2 size={20} />
          <span>Text to Speech</span>
        </a>

        {/* AI Conversation */}
        <button
          type="button"
          onClick={() => navigate("/ai-conversation")}
          className="shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900"
        >
          <Bot size={20} />
          <span>AI Conversation</span>
        </button>

        {/* Live Conversation */}
        <a
          href="#"
          className="shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900"
        >
          <UserRound size={20} />
          <span>Live Conversation</span>
        </a>

        {/* History */}
        <a
          href="#"
          className="shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900"
        >
          <History size={20} />
          <span>History</span>
        </a>

        {/* Saved Conversation */}
        <a
          href="#"
          className="shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900"
        >
          <Bookmark size={20} />
          <span>Saved Conversation</span>
        </a>

        {/* Settings */}
        <a
          href="#"
          className="shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900"
        >
          <Settings size={20} />
          <span>Setting</span>
        </a>

      </nav>

      {/* Robot + Upgrade */}
      <section>

        <img
          src={robot}
          className="mx-auto mt-1 w-40"
          alt="robot-img"
        />

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900">
          Upgrade to Pro
        </div>

      </section>

      {/* Profile */}
      <footer>

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900">
          Profile
        </div>

      </footer>

    </aside>
  );
};

export default Sidebar;