"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ChatBubble } from "@/components/ChatBubble";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
  docs?: { pageContent: string; metadata?: any }[];
};

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastMessageFrom = useRef<"user" | "ai" | null>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", text: input };
    lastMessageFrom.current = "user";
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      lastMessageFrom.current = "ai";
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.message,
          docs: data.docs,
        },
      ]);
    } catch {
      lastMessageFrom.current = "ai";
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Error getting response from server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lastMessageFrom.current === "user") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  const hasUserMessage = messages.some((msg) => msg.role === "user");

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-80px)] p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto flex flex-col space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} role={msg.role} text={msg.text} docs={msg.docs} />
        ))}

        {!hasUserMessage && !loading && (
          <ChatBubble role="ai" text="📄 Upload a PDF to start querying about it!" />
        )}

        {loading && <ChatBubble role="ai" text="AI is thinking..." />}

        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <Input
          className="bg-muted text-foreground"
          placeholder="Ask something about the PDF..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button
          className="bg-primary text-primary-foreground"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Send"}
        </Button>
      </div>
    </div>
  );
}
