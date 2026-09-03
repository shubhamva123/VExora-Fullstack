import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import chatService, { ChatResponse } from "@/services/chat.service";

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatResponse[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  async function loadHistory() {
    try {
      const history = await chatService.history();
      setMessages(history);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load chat history");
    }
  }

  async function sendMessage() {
    if (!input.trim() || isThinking) return;

    const prompt = input.trim();

    const userMessage: ChatResponse = {
      message_id: Date.now(),
      sender: "user",
      message_text: prompt,
      log_date: new Date().toISOString().split("T")[0],
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setIsThinking(true);

    try {
      const response = await chatService.send(prompt);

      const aiMessage: ChatResponse = {
        message_id: Date.now() + 1,
        sender: "ai",
        message_text: response.reply,
        log_date: new Date().toISOString().split("T")[0],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);

      toast.error("Failed to contact AI");

      setMessages((prev) => [
        ...prev,
        {
          message_id: Date.now() + 1,
          sender: "ai",
          message_text: "Unable to contact AI.",
          log_date: new Date().toISOString().split("T")[0],
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        description="Ask anything and get intelligent responses."
        icon={Sparkles}
      />

      <Card className="flex h-[calc(100vh-220px)] flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-5">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center py-24 text-center">
                <Bot className="mb-4 h-14 w-14 text-primary" />
                <h3 className="text-xl font-semibold">
                  Start a conversation
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Ask about coding, study planning, notes, revisions or anything
                  else.
                </p>
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.sender === "user";

              return (
                <div
                  key={message.message_id}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] items-start gap-3 ${
                      isUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {isUser ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {message.message_text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-5 w-5" />
                </div>

                <div className="rounded-2xl bg-muted px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.3s]" />
                    <span className="ml-2">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div className="border-t bg-background p-4">
          <div className="flex gap-3">
            <Input
              value={input}
              placeholder="Ask anything..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <Button
              onClick={sendMessage}
              disabled={isThinking || !input.trim()}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}