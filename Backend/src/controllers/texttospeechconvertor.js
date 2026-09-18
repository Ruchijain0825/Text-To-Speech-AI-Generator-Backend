import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);




export const getVoices = async (req, res) => {
    try {

       

        const response = await axios.get(
            "https://api.elevenlabs.io/v2/voices",
            {
                headers: {
                    "xi-api-key": process.env.ELEVEN_LABS_KEY
                }
            }
        );

        

        return res.status(200).json({
            success: true,
            voices: response.data.voices
        });

    } catch (error) {

       

       

        return res.status(
            error.response?.status || 500
        ).json({
            success: false,
            message:
                error.response?.data?.detail?.message ||
                "Failed to fetch voices"
        });
    }
};




const translateText = async (text, language) => {

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    const prompt = ` You are a translation and content-safety system.
                     Translate the user's text into ${language}.

Rules:
1. Return only the translated text.
2. Do not add explanations.
3. Do not add quotation marks.
4. If the input contains abusive, hateful, threatening,
or seriously offensive content, return exactly:

BLOCKED_CONTENT

Text: ${text}
`;

    const result = await model.generateContent(prompt);

    const translatedText =  result.response.text().trim();
       

    return translatedText;
};




export const generateSpeech = async (req, res) => {

    try {

        const {
            text,
            language,
            voiceId
        } = req.body;


     
        if (!text?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Please enter the text"
            });
        }


        if (!language) {

            return res.status(400).json({
                success: false,
                message: "Please select the language"
            });
        }


        if (!voiceId) {

            return res.status(400).json({
                success: false,
                message: "Please select the voice"
            });
        }


       

        const translatedText =
            await translateText(
                text,
                language
            );

      

        if (
            translatedText ===
            "BLOCKED_CONTENT"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "This text is not appropriate"
            });
        }


   

        const response = await axios.post(

            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,

            {
                text: translatedText,

                model_id:
                    "eleven_multilingual_v2"
            },

            {
                headers: {

                    "xi-api-key":
                        process.env.ELEVEN_LABS_KEY,

                    "Content-Type":
                        "application/json",

                    Accept:
                        "audio/mpeg"
                },

                responseType:
                    "arraybuffer"
            }
        );



        res.set(
            "Content-Type",
            "audio/mpeg"
        );

        return res.send(
            response.data
        );


    } catch (error) {


      


        let errorData =
            error.response?.data;


        if (
            Buffer.isBuffer(errorData)
        ) {

            errorData =
                errorData.toString(
                    "utf8"
                );

            try {

                errorData =
                    JSON.parse(
                        errorData
                    );

            } catch (e) {

                console.log(
                    "Could not parse error"
                );
            }
        }


        console.log(
            "FULL ELEVENLABS ERROR:",
            errorData
        );


        console.log(
            "=============================="
        );


        return res.status(
            error.response?.status ||
            500
        ).json({

            success: false,

            message:
                errorData?.detail?.message ||
                error.message ||
                "Failed to generate speech"
        });
    }
};