import React from "react";
import { 
  Layout, 
  Layers, 
  Settings, 
  Share2, 
  Zap, 
  History,
  // removed Github import — using inline SVG fallback
  Menu
} from "lucide-react";

export default function Header({ status = "Ready" }) {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
      
      {/* Left Section: Brand */}
      <div className="flex items-center gap-4">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-100">
          <Layers className="w-5 h-5 text-white" />
        </div>

        <div>
          <h1 className="font-bold text-slate-900 tracking-tight leading-none text-lg">
            GenUI <span className="text-indigo-600">Studio</span>
          </h1>

          <div className="flex items-center gap-1.5 mt-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                status === "Generating"
                  ? "bg-amber-500 animate-pulse"
                  : "bg-emerald-500"
              }`}
            />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              System: {status}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Navigation Tabs */}
      <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-lg text-indigo-600 flex items-center gap-2">
          <Layout size={14} />
          Editor
        </button>

        <button className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-2 transition-colors">
          <History size={14} />
          History
        </button>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 mr-2">
          <button
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            title="Share Project"
          >
            <Share2 size={18} />
          </button>

          <button
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            title="View Source"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 012 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </button>

          <button
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-1px bg-slate-200 mx-1" />

        {/* Publish Button */}
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 ml-2">
          <Zap size={14} className="fill-white" />
          Publish
        </button>
      </div>
    </header>
  );
}
