import { useState, useEffect, useRef } from "react";
import { sendMessageToAI } from "../../services";
import { useAuth } from "../../context/AuthContext";

export default function ChatWidget() {
  const { user } = useAuth();
  const storageKey = user ? `chatboxMessages_${user.id}` : "chatboxMessages";
  const openKey = user ? `chatboxOpen_${user.id}` : "chatboxOpen";

  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem(openKey) === "true";
  });

  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem(openKey, newState.toString());
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const updatedMessages = [...messages, { from: "user", text: input }];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));

    const response = await sendMessageToAI(input);
    const finalMessages = [...updatedMessages, { from: "ai", text: response }];
    setMessages(finalMessages);
    setIsLoading(false);
    localStorage.setItem(storageKey, JSON.stringify(finalMessages));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-primary text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">Asistente IA NexHack</span>
            <button
              className="btn btn-xs btn-circle btn-ghost"
              onClick={toggleChat}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat ${
                  msg.from === "user" ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    msg.from === "user"
                      ? "chat-bubble-primary"
                      : "chat-bubble-info"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span className="w-3 h-3 border-2 border-dashed border-primary rounded-full animate-spin"></span>
                <span>Escribiendo...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 border-t bg-base-200">
            <div className="flex gap-2">
              <input
                className="input input-sm w-full"
                type="text"
                placeholder="Escribe aquí..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSend}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Enviar"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="btn btn-circle btn-primary animate-bounce"
          title="Abrir chat"
        >
          💬
        </button>
      )}
    </div>
  );
}
