import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Clock, User } from "lucide-react";
import { getConversationHistory } from "../api/conversationApi";
import toast from "react-hot-toast";



const History = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  
const getHistory = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Please login again");
      navigate("/login");
      return;
    }

    const data = await getConversationHistory();

    console.log("HISTORY RESPONSE:", data);

    setConversations(data.conversations || []);
  } catch (error) {
    console.error("HISTORY ERROR:", error);
    toast.error(error.message || "Failed to load history");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  getHistory();
}, []);


  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const handleConversationClick = (conversation) => {
    console.log("SELECTED HISTORY CONVERSATION:", conversation);

    localStorage.setItem("selectedConversation", JSON.stringify({
      id: conversation.conversation_id,
      user1_id: conversation.user1_id,
      user2_id: conversation.user2_id,
    }));

    localStorage.setItem("selectedUser", JSON.stringify({
      id: conversation.other_user_id,
      name: conversation.other_user_name,
      email: conversation.other_user_email,
    }));

    navigate("/dashboard/live-conversation");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">History</h1>
        <p className="mt-2 text-gray-500">Your previous conversations</p>
      </div>

      {loading && <div className="rounded-xl border bg-white p-6"><p className="text-gray-500">Loading conversation history...</p></div>}

      {!loading && conversations.length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <MessageCircle size={42} className="mx-auto text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-700">No conversation history yet</h2>
          <p className="mt-2 text-sm text-gray-500">Start a conversation and it will appear here.</p>
        </div>
      )}

      {!loading && conversations.length > 0 && (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div key={conversation.conversation_id} onClick={() => handleConversationClick(conversation)} className="cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <User size={23} className="text-purple-600" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{conversation.other_user_name}</h2>
                    <p className="text-sm text-gray-500">{conversation.other_user_email}</p>
                  </div>

                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={14} />
                  {formatDate(conversation.last_message_time || conversation.updated_at)}
                </div>
              </div>

              <div className="ml-16 mt-4 text-sm text-gray-600">{conversation.last_message || "No messages yet"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;