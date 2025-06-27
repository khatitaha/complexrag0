import MiniNav from "../comp/miniNav";
import ResizableSidebar from "../comp/ResizableSidebar";
import ChatbotPage from "../chat/[id]/page";
import ClientChatPlaceHolder from "../chat/[id]/chat_client";


export default function LessonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-full w-screen overflow-hidden relative ">
            <div className=" flex flex-col flex-1 ">
                <div className="flex-1 relative bg-neutral-900 overflow-auto">
                    {children}
                </div>

            </div>

            <ResizableSidebar defaultWidth={500}>
                <ClientChatPlaceHolder pageId={""} previousMessages={[]} userId={""} />
            </ResizableSidebar>
        </div>
    );
}
