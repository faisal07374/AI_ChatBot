import { useEffect, useState } from "react";
import { RefreshCcw, Terminal, Box } from "lucide-react";

export default function PreviewWindow({ generatedCode }) {
  const [srcDoc, setSrcDoc] = useState("");
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!generatedCode) return;

    let code = generatedCode
      .replace(/```[\s\S]*?```/g, (match) =>
        match.replace(/```jsx|```js|```javascript|```/g, "")
      )
      .replace(/^#+.*$/gm, "")
      .replace(/^---.*$/gm, "")
      .replace(/^\d+️⃣.*$/gm, "")
      .replace(/^Step\s+\d+.*$/gm, "")
      .replace(/import[\s\S]*?from\s+['"].*?['"];?/g, "")
      .replace(/export\s+default\s+function\s+App/g, "function App")
      .replace(/export\s+default/g, "")
      .trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin:0; font-family:sans-serif; background:#f8fafc; }
  </style>
</head>

<body>
  <div id="root"></div>

  <script type="text/babel">
    const React = window.React;
    const ReactDOM = window.ReactDOM;

    try {

      ${code}

      let Component = typeof App !== "undefined" ? App : null;

      if (!Component) {
        Component = () => (
          <div style={{ padding: 20, color: "red" }}>
            Invalid AI output
          </div>
        );
      }

      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(<Component />);

    } catch (err) {
      document.getElementById("root").innerHTML =
        "<pre style='color:red;padding:20px'>" + err.message + "</pre>";
    }
  </script>
</body>
</html>
`;

    setSrcDoc(html);
  }, [generatedCode]);

  return (
    <main className="flex-1 flex flex-col h-full bg-[#f8fafc] border-l">

      {/* Preview Area */}
      <div className="flex-1 p-3 relative">

        {/* Refresh Button */}
        <button
          onClick={() => setKey((k) => k + 1)}
          className="absolute top-3 right-3 z-10 bg-white border p-2 rounded-lg shadow hover:bg-slate-50"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>

        {!generatedCode ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-xl">
            <Box className="w-10 h-10 opacity-30 mb-2" />
            <p>Waiting for UI...</p>
          </div>
        ) : (
          <iframe
            key={key}
            title="preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border rounded-xl bg-white"
            srcDoc={srcDoc}
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-2 text-xs text-slate-400 flex justify-between border-t bg-white">
        <span className="flex items-center gap-1">
          <Terminal className="w-3 h-3" />
          Sandbox Runtime
        </span>
        <span>JSX Live</span>
      </div>
    </main>
  );
}



// ALL OK