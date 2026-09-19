export const forgetPasswordApi = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/forgetpassword`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};


export const verifyOtpApi = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/verifyotp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};


export const resendOtpApi = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/resendotp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};
export const resetPasswordApi = async (data) => {

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/resetpassword`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};