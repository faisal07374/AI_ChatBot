import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../api/openrouter";
import {
  Send,
  Loader2,
  RefreshCcw,
  StopCircle,
  Sparkles,
} from "lucide-react";

const MAX_CONTEXT = 8;

export default function ChatContainer({
  onCodeGenerated,
  onStartGeneration,
  onHistoryChange,
  activeSession,
  setActiveSession,
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "🚀 Welcome! Tell me what UI you want to build.",
      done: true,
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const abortRef = useRef(null);
  const lastUserPromptRef = useRef("");

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
    const matches = [
      ...text.matchAll(/```(?:jsx|js|javascript|react)?\n([\s\S]*?)```/g),
    ];
    return matches.length ? matches[matches.length - 1][1].trim() : null;
  };

  const updateAssistantMessage = (index, content, done = false) => {
    setMessages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], content, done };
      return copy;
    });
  };

  const saveToHistory = (msgs) => {
    onHistoryChange?.((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: msgs.find((m) => m.role === "user")?.content?.slice(0, 30),
        messages: msgs,
      },
    ]);
  };

  const handleSend = async (customPrompt = null) => {
    const prompt = customPrompt ?? input;

    if (!prompt.trim() || loading) return;

    onStartGeneration?.();
    setError("");

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    lastUserPromptRef.current = prompt;

    const userMsg = { role: "user", content: prompt };

    const updated = [...messages, userMsg].slice(-MAX_CONTEXT);

    setMessages(updated);
    setInput("");
    setLoading(true);

    let assistantIndex = null;

    setMessages((prev) => {
      assistantIndex = prev.length;
      return [...prev, { role: "assistant", content: "", done: false }];
    });

    try {
      let fullReply = "";

      await sendMessage(updated, abortRef.current, (chunk) => {
        fullReply += chunk;

        setMessages((prev) => {
          const copy = [...prev];
          copy[assistantIndex] = {
            role: "assistant",
            content: fullReply + " ▍",
            done: false,
          };
          return copy;
        });
      });

      updateAssistantMessage(assistantIndex, fullReply, true);

      const code = extractCode(fullReply);
      if (code && onCodeGenerated) onCodeGenerated(code);

      saveToHistory([
        ...updated,
        { role: "assistant", content: fullReply },
      ]);
    } catch (err) {
      setError(err.name === "AbortError" ? "⚡ Cancelled" : "⚠️ Error");
    } finally {
      setLoading(false);
    }
  };

  const stopGeneration = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const regenerate = () => {
    if (lastUserPromptRef.current) {
      handleSend(lastUserPromptRef.current);
    }
  };

  const improvePrompt = () => {
    if (!input.trim()) return;
    setInput((prev) => prev + " (make this more detailed and professional)");
  };

  const saveEdit = (i) => {
    const updated = [...messages];
    updated[i].content = editText;
    setMessages(updated);
    setEditingIndex(null);
  };

  // ✅ FIXED KEYBOARD HANDLER
  const handleKeyDown = (e) => {
    if (e.isComposing || e.keyCode === 229) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">

      {/* CHAT */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-[75%] flex flex-col gap-1">

              <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
                m.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white border text-slate-700"
              }`}>

                {editingIndex === i ? (
                  <div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full text-black p-2"
                    />
                    <button
                      onClick={() => saveEdit(i)}
                      className="text-xs text-indigo-600"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  m.content
                )}

              </div>

              {m.role === "user" && (
                <button
                  className="text-xs text-gray-400"
                  onClick={() => {
                    setEditingIndex(i);
                    setEditText(m.content);
                  }}
                >
                  Edit
                </button>
              )}

              {m.role === "assistant" &&
                m.done &&
                i === messages.length - 1 && (
                  <button
                    onClick={regenerate}
                    className="text-xs px-2 py-1 border rounded flex items-center gap-1"
                  >
                    <RefreshCcw size={12} /> Regenerate
                  </button>
                )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-indigo-600 text-sm">
            <Loader2 className="animate-spin w-4 h-4" />
            Generating...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </div>

      {/* INPUT */}
      <div className="border-t bg-white p-3 flex gap-2">

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}   // ✅ FIXED
          className="flex-1 resize-none p-2 bg-slate-100 rounded-lg"
          placeholder="Describe UI..."
        />

        <button onClick={improvePrompt} className="p-2">
          <Sparkles />
        </button>

        {loading ? (
          <button onClick={stopGeneration}>
            <StopCircle />
          </button>
        ) : (
          <button onClick={() => handleSend()}>
            <Send />
          </button>
        )}

      </div>
    </div>
  );
}