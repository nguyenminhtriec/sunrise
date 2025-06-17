import { text } from 'node:stream/consumers';
import {z} from 'zod';

export type Message = {role: string , text: string};

// Option 1: to use with form-inputs and API (POST request)
export async function aiGenerateAndHandleMessage(history: Message[], formData: FormData) {
      
    //const textMessage = formData.get('userTextMessage')?.toString() || '' ;
    const {textMessage} = z.object({textMessage: z.string().min(2)})
      .parse({textMessage: formData.get("userTextMessage")});
    if (!textMessage) return history;
    return [...history, {role: "user", text: textMessage}];
    

    // try {
    //     const response = await fetch('/dashboard/chat/api', {
    //         method: "POST",
    //         headers: {"Content-Type": "application/json"},
    //         body: JSON.stringify({history, textMessage})
    //     });
    //     // if (!response.ok) {
    //     //     throw new Error("API not responding.");
    //     // }
    //     const decoder = new TextDecoder();
    //     const reader = response.body?.getReader();
    //     if (!reader)
    //         return nextHistory;

    //     let modelText = "";
    //     while (true) {
    //         const {value, done} = await reader?.read();
    //         if (done) break;
    //         modelText += decoder.decode(value, {stream: true});
            
    //     }
    //     return [...nextHistory, {role: "model", text: modelText}];

    // } catch (error) {
    //     console.error("Current error: ", error);
    //     return nextHistory;
    // }    
}