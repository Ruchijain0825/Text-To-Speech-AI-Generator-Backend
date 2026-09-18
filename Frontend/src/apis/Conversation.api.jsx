const API_URL = "http://localhost:8080";

const getToken = () =>
  localStorage.getItem("accessToken");


export const getUsers = async () => {
  const response = await fetch(
    `${API_URL}/api/user/users`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }
  );

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch users"
    );
  }

  return data;
};


export const getMessages = async (conversationId) => {
  const response = await fetch(
    `${API_URL}/api/user/messages/${conversationId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }
  );

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch messages"
    );
  }

  return data;
};


export const createConversation = async (user2_id) => {
  const response = await fetch(
    `${API_URL}/api/user/create`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user2_id,
      }),
    }
  );

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create conversation"
    );
  }

  return data;
};


/* =========================================================
   SAVE CONVERSATION
========================================================= */

export const saveConversation = async (conversationId) => {
    const response = await fetch(
        `${API_URL}/api/user/save`,
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
                conversationId,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to save conversation"
        );
    }

    return data;
};


export const unsaveConversation = async (
    conversationId
) => {
    const response = await fetch(
        `${API_URL}/api/user/save/${conversationId}`,
        {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                )}`,
            },

            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to unsave conversation"
        );
    }

    return data;
};


export const checkSavedConversation = async (
    conversationId
) => {
    const response = await fetch(
        `${API_URL}/api/user/save/${conversationId}`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                )}`,
            },

            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to check saved conversation"
        );
    }

    return data;
};


export const getSavedConversations = async () => {
    const response = await fetch(
        `${API_URL}/api/user/saved`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                )}`,
            },

            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch saved conversations"
        );
    }

    return data;
};