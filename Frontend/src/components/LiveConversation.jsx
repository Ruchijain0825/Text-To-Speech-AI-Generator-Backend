import { useEffect, useState } from "react";
import { getUsers } from "../apis/Conversation.api";
import { toast } from "react-hot-toast";
import socket from "../socket";

const LiveConversation = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createConversation, setCreateConversation] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
    

 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();

        console.log("USERS:", response);

        setUsers(response.users || []);
      } catch (error) {
        console.log("Failed to fetch users:", error.message
         
         
        );

        toast.error(
          error.message || "Failed to fetch users"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    const handleUserStatusChanged = (data) => {
      console.log("USER STATUS CHANGED:", data);

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === data.userId
            ? {
                ...user,
                is_online: data.is_online,
                last_seen: data.last_seen,
              }
            : user
        )
      );
    };

    socket.on( "user_status_changed", handleUserStatusChanged);
     
    

    return () => {
      socket.off(
        "user_status_changed",
        handleUserStatusChanged
      );
    };
  }, []);

 
  const handleClickUser = async (user) => {
  try {
    console.log("CLICKED USER:", user);

    setCreateConversation(true);

const response = await fetch(
      "http://localhost:8080/api/user/create",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    credentials: "include",
    body: JSON.stringify({
      user2_id: user.id,
    }),
  }
);

console.log("CREATE STATUS:", response.status);

const text = await response.text();

console.log("CREATE RESPONSE:", text);

if (!response.ok) {
  throw new Error(text || "Conversation creation failed");
}

const data = JSON.parse(text);

console.log("CONVERSATION:", data.conversation);

setSelectedUser(user);
setSelectedConversation(data.conversation);

    toast.success("Conversation opened");

  } catch (error) {
    console.log(
      "Conversation creation failed:",
      error.message
    );

    toast.error(
      error.message || "Conversation creation failed"
    );
  } finally {
    setCreateConversation(false);
  }
};

  // LOADING
  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">
          Loading Users...
        </h1>
      </div>
    );
  }

  // =========================
  // CHAT WINDOW
  // =========================

  if (selectedUser && selectedConversation) {
    return (
      <div className="h-[calc(100vh-64px)] p-6">

        <div className="h-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border flex flex-col">

          {/* CHAT HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b">

            <div className="flex items-center gap-3">

              <button
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedConversation(null);
                }}
                className="text-gray-500 hover:text-gray-800"
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


          {/* MESSAGES AREA */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">

            <div className="flex justify-center">
              <p className="text-sm text-gray-400">
                No messages yet
              </p>
            </div>

          </div>


          {/* MESSAGE INPUT */}
          <div className="border-t p-4">

            <div className="flex items-center gap-3">

              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <button
                className="px-5 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
              >
                Send
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =========================
  // USERS LIST
  // =========================

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
              onClick={() =>
                handleClickUser(user)
              }
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