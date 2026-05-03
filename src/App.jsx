import React, { useState } from "react";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import PreviewWindow from "./components/PreviewWindow";

export default function Dashboard() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Called when AI finishes a block or sends a final update
  const handleCodeUpdate = (code) => {
    setGeneratedCode(code);
    setIsGenerating(false); 
  };

  // Triggered when user clicks "Send" to show the "Generating" status in Header
  const handleStartGeneration = () => {
    setIsGenerating(true);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* 1. Header: Displays global status */}
      <Header status={isGenerating ? "Generating" : "Ready"} />

      {/* 2. Workspace: Flexible layout */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* Sidebar: Fixed width with corrected Tailwind class */}
        <div className="w-400px border-r bg-white flex flex-col shrink-0 shadow-lg z-10 overflow-hidden">
          <ChatContainer 
            onCodeGenerated={handleCodeUpdate} 
            onStartGeneration={handleStartGeneration}
          />
        </div>

        {/* Main Content: Live Preview viewport */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          {/* Added a subtle inner shadow to the preview area for a 
            "professional IDE" depth effect 
          */}
          <div className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] pointer-events-none z-0" />
          
          <div className="h-full relative z-10">
            <PreviewWindow generatedCode={generatedCode} />
          </div>
        </div>
        
      </main>
    </div>
  );
}