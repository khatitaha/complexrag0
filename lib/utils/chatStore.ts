import { create } from "zustand";

type ChatStore = {
    initialPrompt: string | null;
    setInitialPrompt: (prompt: string) => void;
    clearPrompt: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
    initialPrompt: null,
    setInitialPrompt: (prompt) => set({ initialPrompt: prompt }),
    clearPrompt: () => set({ initialPrompt: null }),
}));
