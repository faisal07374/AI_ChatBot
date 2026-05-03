import React, { useState } from "react";
import { Layout, Layers, Settings, Share2, Zap, History } from "lucide-react";

export default function Header({
  status = "Ready",
  history = [],
  onSelectHistory,
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 relative">

      {/* BRAND */}
      <div className="flex items-center gap-4">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <Layers className="text-white w-5 h-5" />
        </div>
        <h1 className="font-bold">
          GenUI <span className="text-indigo-600">Studio</span>
        </h1>
      </div>

      {/* CENTER */}
      <div className="flex gap-2 items-center">
        <button className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
          <Layout size={14} /> Editor
        </button>

        {/* HISTORY */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg"
          >
            <History size={14} /> History
          </button>

          {open && (
            <div className="absolute top-10 left-0 w-64 bg-white border shadow-lg rounded-lg z-50">
              {history.length === 0 ? (
                <div className="p-3 text-sm text-gray-400">No history</div>
              ) : (
                history.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => {
                      onSelectHistory(h);
                      setOpen(false);
                    }}
                    className="p-2 hover:bg-slate-100 cursor-pointer text-sm"
                  >
                    {h.title || "Untitled"}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* STATUS */}
      <div className="text-xs text-gray-500">{status}</div>
    </header>
  );
}