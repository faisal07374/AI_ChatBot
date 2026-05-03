import { useState, useRef, useEffect } from "react";
import ChatContainer from "./ChatContainer";
import PreviewWindow from "./PreviewWindow";

export default function Workspace({
  generatedCode,
  onCodeGenerated,
  onStartGeneration,
}) {
  const [leftWidth, setLeftWidth] = useState(40);
  const dragging = useRef(false);

  const startDrag = () => {
    dragging.current = true;
    // attach window listeners so dragging works even if cursor leaves the area
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
  };

  const stopDrag = () => {
    dragging.current = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
  };

  const onDrag = (e) => {
    if (!dragging.current) return;

    const newWidth = (e.clientX / window.innerWidth) * 100;

    if (newWidth < 20 || newWidth > 80) return;

    setLeftWidth(newWidth);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full">
      {/* CHAT */}
      <div style={{ width: `${leftWidth}%` }} className="h-full">
        <ChatContainer
          onCodeGenerated={onCodeGenerated}
          onStartGeneration={onStartGeneration}
        />
      </div>

      {/* DIVIDER */}
      <div
        onMouseDown={startDrag}
        onTouchStart={(e) => { e.preventDefault(); startDrag(); }}
        onTouchEnd={stopDrag}
        role="separator"
        aria-orientation="vertical"
        className="w-4 cursor-col-resize bg-transparent hover:bg-indigo-50 transition flex items-center justify-center z-30"
        style={{ touchAction: 'none' }}
      >
        <div className="w-2px h-full bg-slate-300 hover:bg-indigo-500 rounded" />
      </div>

      {/* PREVIEW */}
      <div className="flex-1 h-full">
        <PreviewWindow generatedCode={generatedCode} />
      </div>
    </div>
  );
}