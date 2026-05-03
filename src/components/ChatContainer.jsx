import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../api/openrouter";
import { Send, Loader2 } from "lucide-react";

const MAX_CONTEXT = 8;

export default function ChatContainer({ onCodeGenerated, onStartGeneration }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "🚀 Welcome! Tell me what UI you want to build.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const extractCode = (text) => {
    const matches = [...text.matchAll(/```(?:jsx|js|javascript|react)?\n([\s\S]*?)```/g)];
    return matches.length ? matches[matches.length - 1][1].trim() : null;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    onStartGeneration?.();
    setError("");

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const userMsg = { role: "user", content: input };
    const updated = [...messages, userMsg].slice(-MAX_CONTEXT);

    setMessages(updated);
    setInput("");
    setLoading(true);

    let assistantIndex = null;

    setMessages((prev) => {
      assistantIndex = prev.length;
      return [...prev, { role: "assistant", content: "" }];
    });

    try {
      let fullReply = "";

      await sendMessage(updated, abortRef.current, (chunk) => {
        fullReply += chunk;

        setMessages((prev) => {
          const copy = [...prev];
          copy[assistantIndex] = {
            role: "assistant",
            content: fullReply,
          };
          return copy;
        });
      });

      const code = extractCode(fullReply);
      if (code && onCodeGenerated) onCodeGenerated(code);

    } catch (err) {
      setError(err.name === "AbortError" ? "⚡ Cancelled" : "⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-md"
                  : "bg-white border text-slate-700 rounded-bl-md"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-indigo-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating UI...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-white p-3">
        <div className="flex items-end gap-2 bg-slate-100 rounded-xl p-2 border">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the UI you want..."
            className="flex-1 bg-transparent outline-none resize-none text-sm px-2 py-1 max-h-32"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



// ALL OK