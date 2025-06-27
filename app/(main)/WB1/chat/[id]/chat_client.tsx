'use client';

import { Button } from '@/components/ui/button';
import { Message, useChat } from '@ai-sdk/react';
import * as React from 'react'
import { useEffect, useRef, useState } from 'react';
import { CloudUpload, MoveDown, Paperclip, Send } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useChatStore } from '@/lib/utils/chatStore';
import AiSkilitonLoading from '../../comp/aiskeletonLoading';
////// unused for simplicity , 
// import { createClient } from '@/utils/supabase/client';
// import { useMessageManagement } from '@/hooks/useMessageManagement';
// import { UpgradeModal } from '@/components/UpgradeModal';
// import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
    pageId: string
    previousMessages: Message[]
    userId: string
};

const ClientChatPlaceHolder = ({ pageId, previousMessages, userId }: Props) => {
    const [hasUploadedFile, setHasUploadedFile] = useState<boolean>(false);
    const [isRefetching, setIsRefetching] = useState<boolean>(false);
    const { messages, input, handleInputChange, handleSubmit, append, isLoading, setMessages, error, reload } =
        useChat({
            api: hasUploadedFile ? '/api/chatWithRev' : '/api/chat',
            body: {
                userId: userId,
                conversationId: pageId,
            }

        });
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);



    //////// new storing logic
    const [needToStore, setNeedToStore] = useState<boolean>(false);
    useEffect(() => {
        if (!isLoading && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];

            if (lastMessage?.role === "assistant") {
                setNeedToStore(true);
            }
        }
    }, [isLoading]);

    useEffect(() => {
        if (needToStore) {
            const lastTwoMessages = messages.slice(-2);

            // storingMessagesAfterStream(lastTwoMessages, pageId)  ; 
            setNeedToStore(false); // Reset after storing
        }
    }, [needToStore]);
    ///////////////end of the new storing logic


    const { initialPrompt, clearPrompt } = useChatStore();

    /// get initial prompt and send it to ai
    useEffect(() => {
        if (initialPrompt) {
            append({ content: initialPrompt, role: "user" });
            clearPrompt();
        }
    }, [initialPrompt]);


    /// submiting new message
    const handlingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("im suing this");
        console.log(`${pageId}`, !input.trim());
        handleSubmit()
        if (!pageId) return;

        try {
            // await storeMessage(pageId, input, 'user');
        } catch (error) {
            console.error('Error storing messages:', error);
        }
    };

    useEffect(() => {
        if (previousMessages.length > 0 && messages.length === 0) {
            setMessages(previousMessages);
        }
    }, [previousMessages, setMessages]);


    // Upload PDF function
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    // const userRole = useUserRole(userId);

    const handleUploadClick = () => {
        //   if (userRole !== 'pro') {
        //     setShowUpgradeModal(true);
        //   }
    };



    return (
        <div className="  h-full bg-red-900 relative, p-4">
            <div className="flex-1 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 80px)" }}>
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} my-2`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-[75%] ${m.role === "user"
                                ? "bg-neutral-800 text-white self-end"
                                : " text-white self-start"
                                }`}
                        >
                            {/* Apply bold formatting using dangerouslySetInnerHTML */}
                            <span className=''
                                dangerouslySetInnerHTML={{
                                    __html: m.content.replace(/\*\*(.*?)\*\*/g, "<strong class='text-lg'>$1</strong>"),
                                }}
                            />
                        </div>
                    </div>

                ))}
                <div ref={messagesEndRef}></div>


                <div className='h-36'></div>

            </div>


            {isLoading ?? <AiSkilitonLoading />}
            <button type="button" onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })} className='fixed right-5 bottom-44 text-neutral-200 rounded-full  p-2' >
                <MoveDown strokeWidth={3} size={30} />
            </button>
            <div className=' fixed bottom-0 flex py-5 bg-neutral-200 w-1/2 justify-center'>
                <form onSubmit={handlingSubmit} className=" bg-neutral-900 flex flex-col p-5 rounded-xl shadow-sm shadow-neutral-800 w-1/2 max-w-3xl gap-3 ">

                    <div className='flex items-center justify-center gap-3'>
                        <input value={input} onChange={handleInputChange} placeholder='write something' className=" w-full  bg-neutral-900 rounded-sm border border-transparent focus:outline-none focus:border-transparent focus:ring-0 px-1 text-white placeholder-gray-400"
                        />
                        <button className='items-baseline flex justify-end' type='submit'><Send /></button>

                    </div>


                </form>
            </div>

            <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <DialogContent className="bg-neutral-900 text-white border-neutral-800">
                    <DialogHeader>
                        <DialogTitle>Upgrade Required</DialogTitle>
                        <DialogDescription className="text-neutral-400">
                            File upload is a Pro feature. Upgrade your plan to access this functionality.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default ClientChatPlaceHolder;




