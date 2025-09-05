import { GoogleGenAI, type Chat } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';

let ai: GoogleGenAI | null = null;

const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set.");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const initChatSession = (): Chat => {
    const genAI = getAI();
    return genAI.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_PROMPT,
        },
    });
};


export const sendMessageAndGetStream = async (chat: Chat, message: string): Promise<AsyncGenerator<string, any, unknown>> => {
    const result = await chat.sendMessageStream({ message });

    async function* streamGenerator() {
        for await (const chunk of result) {
            yield chunk.text;
        }
    }
    
    return streamGenerator();
};
