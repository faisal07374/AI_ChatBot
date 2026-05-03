import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode }) {
  return (
    <div className="h-full border-l border-slate-200">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        theme="vs-dark"
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          automaticLayout: true,
        }}
      />
    </div>
  );
}