import ChatContainer from "@/components/chat/ChatContainer";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function ChatPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing h-[100dvh] flex flex-col">
      <Header />
      <main className="flex-1 min-h-0 p-4 md:p-6 max-w-4xl mx-auto w-full flex flex-col">
        <ChatContainer />
      </main>
      <Footer />
    </div>
  );
}
