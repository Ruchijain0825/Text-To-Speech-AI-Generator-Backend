import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);


// ===============================
// GET ELEVENLABS VOICES
// ===============================

export const getVoices = async (req, res) => {
    try {

        console.log(
            "ELEVEN KEY EXISTS:",
            !!process.env.ELEVEN_LABS_KEY
        );

        const response = await axios.get(
            "https://api.elevenlabs.io/v2/voices",
            {
                headers: {
                    "xi-api-key": process.env.ELEVEN_LABS_KEY
                }
            }
        );

        console.log(
            "ELEVENLABS VOICES:",
            response.data.voices.length
        );

        return res.status(200).json({
            success: true,
            voices: response.data.voices
        });

    } catch (error) {

        console.log(
            "GET VOICES ERROR:",
            error.message
        );

        console.log(
            "GET VOICES STATUS:",
            error.response?.status
        );

        console.log(
            "GET VOICES DATA:",
            error.response?.data
        );

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


// ===============================
// GEMINI TRANSLATION
// ===============================

const translateText = async (text, language) => {

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    const prompt = `
You are a translation and content-safety system.

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

    const translatedText =
        result.response.text().trim();

    return translatedText;
};


// ===============================
// GENERATE SPEECH
// ===============================

export const generateSpeech = async (req, res) => {

    try {

        const {
            text,
            language,
            voiceId
        } = req.body;


        // -------------------------------
        // VALIDATION
        // -------------------------------

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


        // -------------------------------
        // GEMINI TRANSLATION
        // -------------------------------

        const translatedText =
            await translateText(
                text,
                language
            );

        console.log(
            "TRANSLATED TEXT:",
            translatedText
        );


        // -------------------------------
        // CONTENT SAFETY
        // -------------------------------

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


        // -------------------------------
        // ELEVENLABS DEBUG
        // -------------------------------

        console.log(
            "VOICE ID:",
            voiceId
        );

        console.log(
            "SENDING TEXT TO ELEVENLABS:",
            translatedText
        );

        console.log(
            "ELEVEN KEY EXISTS:",
            !!process.env.ELEVEN_LABS_KEY
        );


        // -------------------------------
        // ELEVENLABS TEXT TO SPEECH
        // -------------------------------

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


        // -------------------------------
        // SEND AUDIO
        // -------------------------------

        res.set(
            "Content-Type",
            "audio/mpeg"
        );

        return res.send(
            response.data
        );


    } catch (error) {


        // -------------------------------
        // ERROR HANDLING
        // -------------------------------

        console.log(
            "=============================="
        );

        console.log(
            "GENERATE SPEECH ERROR"
        );

        console.log(
            "ERROR MESSAGE:",
            error.message
        );

        console.log(
            "ERROR STATUS:",
            error.response?.status
        );


        let errorData =
            error.response?.data;


        // ElevenLabs error can arrive
        // as Buffer because responseType
        // is arraybuffer

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