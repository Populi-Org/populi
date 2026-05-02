import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatContainer from "@/components/chat/ChatContainer";

export default function ChatPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-6 pt-4 md:pt-24 max-w-4xl mx-auto w-full flex flex-col">
        <div className="mb-4">
          <h1 className="font-headline text-3xl font-bold text-primary">
            Assistente Populi
          </h1>
          <p className="font-body text-on-surface-variant text-sm mt-1">
            Converse com o nosso assistente para obter informações sobre
            deputados e atividade parlamentar em Portugal.
          </p>
        </div>
        <ChatContainer />
      </main>
      <Footer />
    </div>
  );
}
