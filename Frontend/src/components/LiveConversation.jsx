import { useEffect, useState } from "react";
import { getUsers, getMessages } from "../apis/Conversation.api";
import { toast } from "react-hot-toast";
import socket from "../socket";

const LiveConversation = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createConversation, setCreateConversation] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editMessageId, setEditMessageId] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [selecFile, setSelectFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectFile(file);
  };

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));

      return (
        payload.id ||
        payload.userId ||
        payload.user_id ||
        payload.sub ||
        null
      );
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const formatMessage = (msg) => ({
    ...msg,
    conversationId: msg.conversationId ?? msg.conversation_id,
    senderId: msg.senderId ?? msg.sender_id,
    receiverId: msg.receiverId ?? msg.receiver_id,
    createdAt: msg.createdAt ?? msg.created_at,
    messageType: msg.messageType ?? msg.message_type ?? "text",
    attachmentUrl: msg.attachmentUrl ?? msg.attachment_url ?? null,
  });

  useEffect(() => {
    if (isLoading) return;

    const restoreConversation = async () => {
      try {
        const savedConversation =
          localStorage.getItem("selectedConversation");

        const savedUser =
          localStorage.getItem("selectedUser");

        if (!savedConversation || !savedUser) {
          setMessagesLoaded(true);
          return;
        }

        const conversation = JSON.parse(savedConversation);
        const user = JSON.parse(savedUser);

        setSelectedConversation(conversation);
        setSelectedUser(user);

        const savedMessages = localStorage.getItem(
          `messages_${conversation.id}`
        );

        const localMessages = savedMessages
          ? JSON.parse(savedMessages)
          : [];

        if (localMessages.length) {
          setMessages(localMessages);
        }

        const response = await getMessages(conversation.id);

        const databaseMessages = (
          response?.messages || []
        ).map(formatMessage);

        if (databaseMessages.length) {
          setMessages(databaseMessages);

          localStorage.setItem(
            `messages_${conversation.id}`,
            JSON.stringify(databaseMessages)
          );
        } else if (!localMessages.length) {
          setMessages([]);
        }

        setMessagesLoaded(true);
      } catch (error) {
        console.log("Restore error:", error);
        setMessagesLoaded(true);
      }
    };

    restoreConversation();
  }, [isLoading]);

  useEffect(() => {
    const handleDeletedMessage = (deletedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          String(msg.id) === String(deletedMessage.id)
            ? {
                ...msg,
                message: "This message was deleted",
                is_deleted: true,
              }
            : msg
        )
      );

      setOpenMenuId(null);
    };

    socket.on("message_deleted", handleDeletedMessage);

    return () => {
      socket.off("message_deleted", handleDeletedMessage);
    };
  }, []);

  useEffect(() => {
    const handleEditedMessage = (updatedMessage) => {
      const formatted = formatMessage(updatedMessage);

      setMessages((prev) =>
        prev.map((msg) =>
          String(msg.id) === String(formatted.id)
            ? { ...msg, ...formatted }
            : msg
        )
      );

      setEditMessageId("");
      setEditMessage("");
      setOpenMenuId(null);
    };

    socket.on("message_updated", handleEditedMessage);

    return () => {
      socket.off("message_updated", handleEditedMessage);
    };
  }, []);

  useEffect(() => {
    if (!selectedConversation || !messagesLoaded) return;

    localStorage.setItem(
      `messages_${selectedConversation.id}`,
      JSON.stringify(messages)
    );
  }, [messages, selectedConversation, messagesLoaded]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();

        console.log("USERS RESPONSE:", response);

        setUsers(response.users || []);
      } catch (error) {
        console.log("Users error:", error);
        toast.error(error.message || "Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    const handleStatus = (data) => {
      setUsers((prev) =>
        prev.map((user) =>
          String(user.id) === String(data.userId)
            ? {
                ...user,
                is_online:
                  data.is_online ?? data.isOnline,
                last_seen: data.last_seen,
              }
            : user
        )
      );

      setSelectedUser((prev) =>
        prev && String(prev.id) === String(data.userId)
          ? {
              ...prev,
              is_online:
                data.is_online ?? data.isOnline,
              last_seen: data.last_seen,
            }
          : prev
      );
    };

    socket.on("user_status_changed", handleStatus);

    return () => {
      socket.off("user_status_changed", handleStatus);
    };
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      const formatted = formatMessage(data);

      if (
        selectedConversation &&
        formatted.conversationId &&
        String(formatted.conversationId) !==
          String(selectedConversation.id)
      ) {
        return;
      }

      setMessages((prev) => {
        const alreadyExists = prev.some(
          (msg) => String(msg.id) === String(formatted.id)
        );

        if (alreadyExists) return prev;

        return [...prev, formatted];
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedConversation]);

  const handleClickUser = async (user) => {
    try {
      setCreateConversation(true);

      const response = await fetch(
        "http://localhost:8080/api/user/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(
              "accessToken"
            )}`,
          },
          credentials: "include",
          body: JSON.stringify({
            user2_id: user.id,
          }),
        }
      );

      const text = await response.text();

      console.log("CREATE CONVERSATION:", text);

      if (!response.ok) {
        throw new Error(
          text || "Conversation creation failed"
        );
      }

      const data = JSON.parse(text);

      const conversation = data.conversation;

      setSelectedUser(user);
      setSelectedConversation(conversation);
      setMessagesLoaded(false);
      setMessages([]);
      setOpenMenuId(null);
      setEditMessageId("");
      setEditMessage("");

      localStorage.setItem(
        "selectedConversation",
        JSON.stringify(conversation)
      );

      localStorage.setItem(
        "selectedUser",
        JSON.stringify(user)
      );

      const responseMessages = await getMessages(
        conversation.id
      );

      const formattedMessages = (
        responseMessages?.messages || []
      ).map(formatMessage);

      setMessages(formattedMessages);

      localStorage.setItem(
        `messages_${conversation.id}`,
        JSON.stringify(formattedMessages)
      );

      setMessagesLoaded(true);

      toast.success("Conversation opened");
    } catch (error) {
      console.log("Conversation error:", error);

      toast.error(
        error.message || "Conversation creation failed"
      );

      setMessagesLoaded(true);
    } finally {
      setCreateConversation(false);
    }
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage && !selecFile) return;

    if (!selectedConversation) {
      toast.error("Please select a conversation first");
      return;
    }

    if (!currentUserId) {
      toast.error("User authentication not found");
      return;
    }

    const receiverId = selectedUser?.id;

    if (!receiverId) {
      toast.error("Receiver not found");
      return;
    }

    try {
      let attachmentUrl = null;
      let messageType = "text";

      if (selecFile) {
        setIsUploading(true);

        const formData = new FormData();

        formData.append("file", selecFile);

        const response = await fetch(
          "http://localhost:8080/api/user/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        console.log("UPLOAD RESPONSE:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "File upload failed"
          );
        }

        attachmentUrl = data.url;

        if (selecFile.type.startsWith("image/")) {
          messageType = "image";
        } else if (selecFile.type.startsWith("video/")) {
          messageType = "video";
        } else if (selecFile.type.startsWith("audio/")) {
          messageType = "audio";
        } else {
          messageType = "file";
        }

        setIsUploading(false);
      }

      const messageData = {
        conversationId: selectedConversation.id,
        senderId: currentUserId,
        receiverId,
        message: trimmedMessage,
        messageType,
        attachmentUrl,
      };

      console.log("SOCKET MESSAGE:", messageData);

      socket.emit("send_message", messageData);

      const newMessage = {
        ...messageData,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      setMessage("");
      setSelectFile(null);
    } catch (error) {
      setIsUploading(false);

      console.error("SEND ERROR:", error);

      toast.error(error.message || "Message send failed");
    }
  };

  const handleDeleteMessage = (msg) => {
    if (!msg.id || String(msg.id).startsWith("local-")) {
      toast.error("Please wait until message is saved");
      return;
    }

    socket.emit("delete_message", {
      messageId: msg.id,
      senderId: currentUserId,
    });

    setOpenMenuId(null);
  };

  const handleEditMessage = (msg) => {
    if (msg.is_deleted) return;

    if (String(msg.id).startsWith("local-")) {
      toast.error("Please wait until message is saved");
      return;
    }

    setEditMessageId(msg.id);
    setEditMessage(msg.message || "");
    setOpenMenuId(null);
  };

  const handleSaveEdit = () => {
    const trimmedMessage = editMessage.trim();

    if (!trimmedMessage || !editMessageId) return;

    socket.emit("edit_message", {
      messageId: editMessageId,
      senderId: currentUserId,
      message: trimmedMessage,
    });
  };

  const handleCancelEdit = () => {
    setEditMessageId("");
    setEditMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      editMessageId
        ? handleSaveEdit()
        : handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        Loading Users...
      </div>
    );
  }

  if (selectedUser && selectedConversation) {
    return (
      <div className="h-[calc(100vh-64px)] p-6">
        <div className="h-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border flex flex-col">

          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-3">

              <button
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedConversation(null);
                  setMessages([]);
                  setMessage("");
                  setSelectFile(null);
                  setMessagesLoaded(false);
                  setOpenMenuId(null);
                  setEditMessageId("");
                  setEditMessage("");

                  localStorage.removeItem(
                    "selectedConversation"
                  );

                  localStorage.removeItem(
                    "selectedUser"
                  );
                }}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ←
              </button>

              <div>
                <h2 className="font-semibold text-lg">
                  {selectedUser.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedUser.is_online
                    ? "Online"
                    : "Offline"}
                </p>
              </div>
            </div>

            <div
              className={`w-3 h-3 rounded-full ${
                selectedUser.is_online
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            />
          </div>

          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex justify-center">
                <p className="text-sm text-gray-400">
                  No messages yet
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">

                {messages.map((msg, index) => {
                  const isMine =
                    String(msg.senderId) ===
                    String(currentUserId);

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex ${
                        isMine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`relative max-w-[70%] px-4 py-3 rounded-2xl ${
                          isMine
                            ? "bg-indigo-500 text-white rounded-br-md"
                            : "bg-white text-gray-800 border rounded-bl-md"
                        }`}
                      >

                        {msg.messageType === "image" &&
                          msg.attachmentUrl && (
                            <img
                              src={msg.attachmentUrl}
                              alt="attachment"
                              className="max-w-xs rounded-lg mb-2"
                            />
                          )}

                        {msg.messageType === "video" &&
                          msg.attachmentUrl && (
                            <video
                              src={msg.attachmentUrl}
                              controls
                              className="max-w-xs rounded-lg mb-2"
                            />
                          )}

                        {msg.messageType === "audio" &&
                          msg.attachmentUrl && (
                            <audio
                              src={msg.attachmentUrl}
                              controls
                              className="mb-2"
                            />
                          )}

                        {msg.messageType === "file" &&
                          msg.attachmentUrl && (
                            <a
                              href={msg.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="underline block mb-2"
                            >
                              📄 Open File
                            </a>
                          )}

                        {msg.message && (
                          <p
                            className={
                              isMine && !msg.is_deleted
                                ? "pr-5"
                                : ""
                            }
                          >
                            {msg.message}
                          </p>
                        )}

                        {msg.is_edited &&
                          !msg.is_deleted && (
                            <span className="text-[10px] opacity-70 ml-1">
                              edited
                            </span>
                          )}

                        {isMine && !msg.is_deleted && (
                          <div className="absolute top-1 right-1">

                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === msg.id
                                    ? null
                                    : msg.id
                                )
                              }
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 text-white/80"
                            >
                              ⋮
                            </button>

                            {openMenuId === msg.id && (
                              <div className="absolute right-0 top-7 z-50 w-24 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-lg overflow-hidden">

                                <button
                                  onClick={() =>
                                    handleEditMessage(msg)
                                  }
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteMessage(msg)
                                  }
                                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
                                >
                                  Delete
                                </button>

                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </div>

          <div className="border-t p-4">

            {selecFile && (
              <div className="flex items-center gap-2 mb-3 px-2">
                <span className="text-sm text-gray-600">
                  📎 {selecFile.name}
                </span>

                <button
                  onClick={() => setSelectFile(null)}
                  className="text-red-500"
                >
                  X
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">

              {!editMessageId && (
                <label className="cursor-pointer text-xl">
                  📎

                  <input
                    type="file"
                    hidden
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                  />
                </label>
              )}

              <input
                type="text"
                value={
                  editMessageId
                    ? editMessage
                    : message
                }
                onChange={(e) =>
                  editMessageId
                    ? setEditMessage(e.target.value)
                    : setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder={
                  editMessageId
                    ? "Edit message..."
                    : "Type a message..."
                }
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              />

              {editMessageId ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-3 rounded-xl border hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveEdit}
                    disabled={!editMessage.trim()}
                    className="px-5 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSendMessage}
                  disabled={
                    !message.trim() && !selecFile
                  }
                  className="px-5 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  {isUploading
                    ? "Uploading..."
                    : "Send"}
                </button>
              )}

            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-semibold">
        Live Conversation
      </h1>

      <p className="mt-2 text-gray-500">
        Select a user to start a conversation
      </p>

      <div className="mt-8 max-w-xl">

        {users.length === 0 ? (
          <div className="bg-white p-5 rounded-xl shadow">
            No other users found
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleClickUser(user)}
              className="flex items-center justify-between p-4 mb-3 bg-white rounded-xl shadow-sm border cursor-pointer hover:bg-gray-50"
            >
              <div>
                <h2 className="font-semibold text-gray-800">
                  {user.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
              </div>

              <div className="flex items-center gap-2">

                <span
                  className={`w-3 h-3 rounded-full ${
                    user.is_online
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />

                <span className="text-sm text-gray-600">
                  {user.is_online
                    ? "Online"
                    : "Offline"}
                </span>

              </div>
            </div>
          ))
        )}

      </div>

      {createConversation && (
        <p className="mt-4 text-gray-500">
          Opening conversation...
        </p>
      )}

    </div>
  );
};

export default LiveConversation;