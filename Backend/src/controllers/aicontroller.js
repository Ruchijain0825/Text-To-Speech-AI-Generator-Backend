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
      model: "gemini-3.6-flash",
     })

    
    const formattedHistory = history
      .map((item) => {
        let role = item.role;

        if (role === "assistant") {
          role = "model";
        }

        return {
          role,
          parts: [
            {
              text: item.text || "",
            },
          ],
        };
      })
      .filter((item) => item.parts[0].text.trim() !== "");


    if (
      formattedHistory.length > 0 &&
      formattedHistory[0].role === "model"
    ) {
      formattedHistory.shift();
    }


    const chat = model.startChat({
      history: formattedHistory,
    });

 
    const result = await chat.sendMessage(message);


    const response = result.response;

    const reply = response.text();

 
    return res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};