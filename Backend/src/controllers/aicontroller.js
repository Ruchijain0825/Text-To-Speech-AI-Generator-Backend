import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const chat = model.startChat({
      history: history.map((item) => ({
        role: item.role,
        parts: [
          {
            text: item.text,
          },
        ],
      })),
    });

    const result = await chat.sendMessage(message);

    const response = result.response.text();

    res.status(200).json({
      success: true,
      reply: response,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get AI response",
      error: error.message,
    });
  }
};