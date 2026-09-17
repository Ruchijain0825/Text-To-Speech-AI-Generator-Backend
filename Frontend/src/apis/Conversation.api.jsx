export const getUsers = async () => {
  const url = "http://localhost:8080/api/user/users"

  console.log("REQUEST URL:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    credentials: "include",
  });

  console.log("STATUS:", response.status);

  const text = await response.text();

  console.log("RESPONSE:", text);

  if (!response.ok) {
    throw new Error(text || "Failed to fetch users");
  }

  return JSON.parse(text);
};
export const getMessages = async(conversationId)=>
{
  const response = await fetch(url,
    {
      headers:
      {
        Authorization:`Bearer ${localStorage.getItem("accessToken")}`,
      },
      credentials:"include"
    }
  )
  const text = await response.text();
  if(!response.ok)
  {
    throw new Error(text||"failed to fetch messages")
  }
  return JSON.parse(text)
}