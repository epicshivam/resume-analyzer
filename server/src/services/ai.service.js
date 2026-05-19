import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

export async function invokeGeminiAi(){
    const reponse = await ai.models.generateContent({
        model:"gemini-2.5-flash-lite",
        contents:"Hello gemini Explain what is interview"
    })

    console.log(reponse.text);
}