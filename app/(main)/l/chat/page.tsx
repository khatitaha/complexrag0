// import { createClient } from "@/utils/supabase/server";
// import { getMessages } from "./actions";
import { cache } from "react";
import ClientChatPlaceHolder from "./chat_client";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ initialPrompt?: string }>;
};

// ✅ Cache messages to prevent refetching on every request
// const getCachedMessages = cache(getMessages);

const ChatPage = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  //   const { initialPrompt } = await searchParams;
  //   const messages = await getCachedMessages(pageId);

  //   const supabase = await createClient()

  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser()

  return (

    <ClientChatPlaceHolder id={id} initialchat={[]} />
  );
};

export default ChatPage;
