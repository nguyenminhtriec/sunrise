
'use client';

import { ChatHistory } from '@/app/ui/chat/chat-history';
import { useState, useEffect, useActionState, useRef } from 'react';
import { Send, X } from 'lucide-react'; 
import { aiGenerateAndHandleMessage, type Message } from "@/app/lib/chat-action";


export function ChatInterface() {

    // const [inputText, setInputText] = useState('');
    // const inputRef = useRef(null);
    const [history, setHistory] = useState<Message[]>([]);
    const [pendingHistory, formAction] = useActionState(sendMessages, []);
    const [streamingText, setStreamingText] = useState('');
    const [streaming, setStreaming] = useState(false);   
    
    async function sendMessages(prev: Message[], formData: FormData) {    
        const userTextMessage = formData.get("userTextMessage")?.toString() || '';
        
        if (!userTextMessage) return prev;
        if (prev.length===0)  // return prev + first user message          
            return [...prev, {role: "user", text: userTextMessage}] 
        // return prev + model's last message + user's current message 
        return [...prev, {role:"model", text: streamingText}, {role: "user", text: userTextMessage}]       
    }
    
    useEffect (() => {
        if (pendingHistory.length===0) return;
        const lastMessage = pendingHistory.at(-1);
        if (!lastMessage || lastMessage.role==="model")
            return;
      
        const startStreaming = async () => {
            setStreaming(true);
            setStreamingText('');
            
            const response = await fetch("/dashboard/chat/api", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({history: pendingHistory}),
            });
            const reader = response.body?.getReader();
            if (!reader) return;
            const decoder = new TextDecoder();
            
            // let modelText = '';
            while (true) {
                const {value, done} = await reader.read();
                if (done) break;
                const chunkText = decoder.decode(value, {stream: true});
                // modelText += chunkText;
                setStreamingText(prev => prev + chunkText);               
            }            
            setHistory([...pendingHistory, {role: "model", text: streamingText}]);
            setStreaming(false);           
        };
        startStreaming();       
    }, [pendingHistory]);

    // const allHistory = [...history]; 
    // if (streamingText) allHistory.push({role: "model", text: streamingText}); 
    
    const allHistory = streamingText ? [...pendingHistory, {role:"model", text: streamingText}] : history;     
       
    console.log(streamingText);   
    console.log("history ", history.length);
    console.log("pendingHistory ", pendingHistory.length);  
    
    return (
        <div className='h-full space-y-8'>  
            <ChatHistory history={allHistory} />        
            <form action={formAction} className='space-y-8'>                                
                <div className='flex w-full justify-start bg-cyan-600 text-gray-100 text-sm'>                           
                    <input className='bg-cyan-700 dark:bg-cyan-900 text-gray-100 w-full'
                        name="userTextMessage" id="userTextMessage"
                        placeholder="Ask me anything..."
                        required                        
                    />                    
                    <div className='flex w-[10%] justify-center space-x-4'>
                        <button type="reset">
                            <X strokeWidth={1} color={'aqua'} />
                        </button>
                        <button type="submit">
                            <Send strokeWidth={1} color='aqua' />
                        </button>
                    </div>                    
                </div>   
            </form>                    
        </div>        
    )
}


