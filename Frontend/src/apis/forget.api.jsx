export const forgetPasswordApi = async (data) => {
  const response = await fetch(
    "http://localhost:8080/api/auth/forgetpassword",
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
    "http://localhost:8080/api/auth/verifyotp",
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
    "http://localhost:8080/api/auth/resendotp",
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
    "http://localhost:8080/api/auth/resetpassword",
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