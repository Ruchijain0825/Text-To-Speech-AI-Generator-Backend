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
        <button
          type="button"
          onClick={() => navigate("/dashboard/text-to-speech")}
          className="shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900"
        >
          <Volume2 size={20} />
          <span>Text to Speech</span>
        </button>

        {/* AI Conversation */}
        <button
          type="button"
          onClick={() => navigate("/dashboard/ai-conversation")}
          className="shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900"
        >
          <Bot size={20} />
          <span>AI Conversation</span>
        </button>

        {/* Live Conversation */}
        <button
          type="button"
          onClick={() => navigate("/dashboard/live-conversation")}
          className="shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900"
        >
          <UserRound size={20} />
          <span>Live Conversation</span>
        </button>

        {/* History */}
        <button
          type="button"
          onClick={() => navigate("/dashboard/history")}
          className="shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900"
        >
          <History size={20} />
          <span>History</span>
        </button>

        {/* Saved Conversation */}
        <button
          type="button"
          onClick={() => navigate("/dashboard/saved")}
          className="shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900"
        >
          <Bookmark size={20} />
          <span>Saved Conversation</span>
        </button>

        {/* Settings */}
       
      </nav>

      {/* Robot + Upgrade */}
      <section>
        <img
          src={robot}
          className="mx-auto mt-1 w-40"
          alt="robot-img"
        />

       
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