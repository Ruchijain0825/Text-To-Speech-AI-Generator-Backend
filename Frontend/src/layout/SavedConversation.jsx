import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Clock, User, Star } from "lucide-react";
import toast from "react-hot-toast";
import { getSavedConversations, unsaveConversation } from "../apis/Conversation.api";

const SavedConversation = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSavedConversations = async () => {
    try {
      setLoading(true);
      const data = await getSavedConversations();
      console.log("SAVED RESPONSE:", data);
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("SAVED ERROR:", error);
      toast.error(error.message || "Failed to load saved conversations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedConversations();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const openConversation = (conversation) => {
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

  const handleUnsave = async (e, conversationId) => {
    e.stopPropagation();

    try {
      await unsaveConversation(conversationId);

      setConversations((prev) => prev.filter((item) => item.conversation_id !== conversationId));

      toast.success("Conversation removed from saved");
    } catch (error) {
      console.error("UNSAVE ERROR:", error);
      toast.error(error.message || "Failed to remove");
    }
  };

  return (
    <div className="p-8">

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Star size={30} className="text-yellow-500" />
          <h1 className="text-3xl font-semibold text-gray-800">Saved Conversation</h1>
        </div>
        <p className="mt-2 text-gray-500">Your saved conversations</p>
      </div>

      {loading && (
        <div className="rounded-xl border bg-white p-6">
          <p className="text-gray-500">Loading saved conversations...</p>
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <Star size={42} className="mx-auto text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-700">No saved conversations</h2>
          <p className="mt-2 text-sm text-gray-500">Save a conversation and it will appear here.</p>
        </div>
      )}

      {!loading && conversations.length > 0 && (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div key={conversation.conversation_id} onClick={() => openConversation(conversation)} className="cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">

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

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={14} />
                    {formatDate(conversation.last_message_time || conversation.updated_at)}
                  </div>

                  <button onClick={(e) => handleUnsave(e, conversation.conversation_id)} className="rounded-lg p-2 hover:bg-gray-100" title="Remove from saved">
                    <Star size={21} className="fill-yellow-400 text-yellow-500" />
                  </button>
                </div>

              </div>

              <div className="mt-4 ml-16 flex items-center gap-2 text-sm text-gray-600">
                <MessageCircle size={16} />
                {conversation.last_message || "No messages yet"}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SavedConversation;