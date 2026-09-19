export const TranslateSpeechGenerator = async (data) => {
    const response = await fetch(
     `${import.meta.env.VITE_API_URL}/api/translate/generate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
    }

    const audioBlob = await response.blob();

    return audioBlob;
};


export const VoiceGenerator = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/translate/voices`
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }

    return result;
};