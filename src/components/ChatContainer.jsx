import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../api/openrouter";
import { Send, Loader2, Sparkles, Terminal } from "lucide-react";

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
  const abortRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const extractCode = (text) => {
    const matches = [...text.matchAll(/```(?:jsx|js|javascript|react)?\n([\s\S]*?)```/g)];
    return matches.length ? matches[matches.length - 1][1].trim() : null;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (onStartGeneration) onStartGeneration(); // Trigger the header pulse!

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

      if (code && onCodeGenerated) {
        onCodeGenerated(code);
      }

    } catch (err) {
      setError(err.name === "AbortError" ? "⚡ Cancelled" : "⚠️ Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">

      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold">GenUI Builder</span>
        </div>
        <Terminal className="w-4 h-4 text-slate-500" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div
              className={`inline-block p-3 rounded-xl text-sm whitespace-pre-wrap ${m.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white border"
                }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-indigo-600 flex items-center gap-2 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating UI...
          </div>
        )}

        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex gap-2">
        <textarea
          className="flex-1 border rounded-lg p-2 text-sm"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
          className="bg-indigo-600 text-white px-4 rounded-lg"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// ALL OK