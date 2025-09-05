import { GoogleGenAI, type GenerateContentResponse, type Chat } from "@google/genai";
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

// Fix: Use function overloads to ensure TypeScript correctly infers the return type based on the arguments.
// This resolves type errors in App.tsx where the return type was ambiguous (Chat | Promise<string>).
export function sendMessageToAI(chat: null, message: null): Chat;
export function sendMessageToAI(chat: Chat, message: string): Promise<string>;
export function sendMessageToAI(chat: Chat | null, message: string | null): Chat | Promise<string> {
    const genAI = getAI();

    if (!chat) {
        return genAI.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_PROMPT,
            },
        });
    }

    if (message === null) {
        throw new Error("Message cannot be null when a chat session is provided.");
    }
    
    const send = async () => {
        const response: GenerateContentResponse = await chat.sendMessage({ message: message });
        return response.text;
    };

    return send();
};
