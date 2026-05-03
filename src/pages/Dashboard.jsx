import React, { useState } from "react";
import Header from "../components/Header";
import Workspace from "../components/Workspace";

export default function Dashboard() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCodeUpdate = (code) => {
    setGeneratedCode(code);
    setIsGenerating(false);
  };

  const handleStartGeneration = () => {
    setIsGenerating(true);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900">
      
      {/* HEADER (unchanged) */}
      <Header status={isGenerating ? "Generating" : "Ready"} />

      {/* NEW WORKSPACE (replace old main layout) */}
      <Workspace
        generatedCode={generatedCode}
        onCodeGenerated={handleCodeUpdate}
        onStartGeneration={handleStartGeneration}
      />

    </div>
  );
}