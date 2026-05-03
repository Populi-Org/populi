import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatContainer from "@/components/chat/ChatContainer";

export default function ChatPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-6 pt-4 md:pt-24 max-w-4xl mx-auto w-full flex flex-col">
        <ChatContainer />
      </main>
      <Footer />
    </div>
  );
}
