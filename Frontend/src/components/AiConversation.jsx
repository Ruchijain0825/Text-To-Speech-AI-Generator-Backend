import { useState } from "react";
import axios from "axios";

const AIConversation = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ role: "model", text: "Hello! 👋 I'm your AI assistant. How can I help you?" }]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    const updatedMessages = [...messages, { role: "user", text: userMessage }];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/chat`, { message: userMessage, history: messages });

      setMessages([...updatedMessages, { role: "model", text: response.data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages([...updatedMessages, { role: "model", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-[#f8f9fc]">
      <div className="border-b bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">🤖 AI Conversation</h1>
        <p className="text-sm text-gray-500">Talk with your AI assistant</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-[#4b3f72] text-white" : "border bg-white text-gray-800 shadow-sm"}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border bg-white px-4 py-3 text-gray-500">AI is thinking...</div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <div className="mx-auto flex max-w-4xl items-end gap-3">
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your message..." rows={1} className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#4b3f72]" />
          <button onClick={sendMessage} disabled={loading || !message.trim()} className="rounded-xl bg-[#4b3f72] px-6 py-3 font-medium text-white transition hover:bg-[#3d335e] disabled:cursor-not-allowed disabled:opacity-50">{loading ? "..." : "Send"}</button>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">Press Enter to send</p>
      </div>
    </div>
  );
};

export default AIConversation;