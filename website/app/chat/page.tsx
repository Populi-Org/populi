import ChatContainer from "@/components/chat/ChatContainer";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function ChatPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-24 pt-4 md:pt-24 mx-auto w-full px-4 flex flex-col">
        <ChatContainer />
      </main>
      <Footer />
    </div>
  );
}
