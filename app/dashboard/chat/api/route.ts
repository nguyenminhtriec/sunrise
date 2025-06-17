
import { GoogleGenAI } from "@google/genai";


export async function POST(request: Request) {

    const apiKey = process.env.G_KEY;
    const ai = new GoogleGenAI({apiKey: apiKey});

    const {history} = await request.json();
    // const nextHistory = inputText ? [...history, {role:"user", text: inputText}] : history;
          
        const stream = await ai.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: [...history],
            config: {
                // maxOutputTokens: 150,
                //systemInstruction: "Always give answers as short as possible."
            }
        });
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const text = chunk.text;
                        controller.enqueue(encoder.encode(text));
                    }
                    controller.close();

                } catch (err) {
                    controller.enqueue(encoder.encode("Error generating content."));
                    controller.close();
                } finally {
                    controller.close();
                }
                
            }
        });
        return new Response(readable, {
            headers: {"Content-Type": "text/plain; charset=utf-8"}
        })
}