import { useState, useEffect, useRef } from "react";
import { sendMessageToAI } from "../../services";
import { useAuth } from "../../context/AuthContext";
import { MoveDiagonal2 } from "lucide-react";

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
  const [size, setSize] = useState({ width: 400, height: 400 });
  const [resizing, setResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 400, height: 400 });
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

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: size.width, height: size.height });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizing) {
        const deltaX = startPos.x - e.clientX;
        const deltaY = startPos.y - e.clientY;
        setSize({
          width: Math.max(300, startSize.width + deltaX),
          height: Math.max(300, startSize.height + deltaY),
        });
      }
    };

    const handleMouseUp = () => {
      if (resizing) setResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing, startPos, startSize]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div
          className="bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col relative"
          style={{ width: `${size.width}px`, height: `${size.height}px` }}
        >
          {/* Header */}
          <div className="bg-primary text-white px-4 py-2 flex items-center justify-between rounded-t-xl relative">
            {/* Handle de resize */}
            <div
              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-nwse-resize p-1 rounded hover:bg-primary-focus flex items-center justify-center"
              onMouseDown={handleMouseDown}
              title="Redimensionar ventana"
            >
              <MoveDiagonal2 size={16} className="text-white opacity-80" />
            </div>

            {/* Título desplazado */}
            <span className="ml-8 font-semibold">Asistente IA NexHack</span>

            {/* Botón de cerrar */}
            <button
              className="btn btn-xs btn-circle btn-ghost text-white"
              onClick={toggleChat}
            >
              ✕
            </button>
          </div>

          {/* Mensajes */}
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

          {/* Input */}
          <div className="p-2 border-t bg-base-200">
            <div className="flex gap-2">
              <input
                className="input input-md w-full"
                type="text"
                placeholder="Escribe aquí..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="btn btn-md btn-primary"
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
          className="btn btn-circle btn-primary animate-bounce w-[5rem] h-[5rem] text-3xl"
          title="Abrir chat"
        >
          💬
        </button>
      )}
    </div>
  );
}
