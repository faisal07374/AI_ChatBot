import React, { useState } from "react";
import Header from "../components/Header";
import Workspace from "../components/Workspace";

export default function Dashboard() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 🧠 NEW: Chat sessions system
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          content: "🚀 Welcome! Tell me what UI you want to build.",
          done: true,
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState(1);

  const handleCodeUpdate = (code) => {
    setGeneratedCode(code);
    setIsGenerating(false);
  };

  const handleStartGeneration = () => {
    setIsGenerating(true);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900">

      {/* HEADER (now supports sessions) */}
      <Header
        status={isGenerating ? "Generating" : "Ready"}
        sessions={sessions}
        activeId={activeId}
        setActiveId={setActiveId}
      />

      {/* WORKSPACE (now session-aware) */}
      <Workspace
        generatedCode={generatedCode}
        onCodeGenerated={handleCodeUpdate}
        onStartGeneration={handleStartGeneration}
        sessions={sessions}
        setSessions={setSessions}
        activeId={activeId}
        setActiveId={setActiveId}
      />

    </div>
  );
}