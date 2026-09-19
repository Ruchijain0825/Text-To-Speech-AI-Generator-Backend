import { logo, robot } from "../assets/assests.js";
import { Bot, Volume2, Bookmark, History, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg">

      <header>
        <img src={logo} width="90px" className="text-lg" alt="logo" />
      </header>

      <nav className="flex flex-col gap-2 p-4 text-sm">

        <button type="button" onClick={() => navigate("/dashboard/text-to-speech")} className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-700 shadow-sm hover:bg-[#635BFF] hover:text-gray-900">
          <Volume2 size={20} /><span>Text to Speech</span>
        </button>

        <button type="button" onClick={() => navigate("/dashboard/ai-conversation")} className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-700 shadow-sm hover:bg-[#635BFF] hover:text-gray-900">
          <Bot size={20} /><span>AI Conversation</span>
        </button>

        <button type="button" onClick={() => navigate("/dashboard/live-conversation")} className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-700 shadow-sm hover:bg-[#635BFF] hover:text-gray-900">
          <UserRound size={20} /><span>Live Conversation</span>
        </button>

        <button type="button" onClick={() => navigate("/dashboard/history")} className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-700 shadow-sm hover:bg-[#635BFF] hover:text-gray-900">
          <History size={20} /><span>History</span>
        </button>

        <button type="button" onClick={() => navigate("/dashboard/saved")} className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-700 shadow-sm hover:bg-[#635BFF] hover:text-gray-900">
          <Bookmark size={20} /><span>Saved Conversation</span>
        </button>

      </nav>

      <section>
        <img src={robot} className="mx-auto mt-1 w-40" alt="robot-img" />
      </section>

     

    </aside>
  );
};

export default Sidebar;