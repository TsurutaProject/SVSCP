"use client";

import { Sandpack } from "@codesandbox/sandpack-react";

const APP_JS = `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h1>カウント: {count}</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
`;

export function SandpackDemo() {
  return (
    <Sandpack
      template="react"
      files={{
        "/App.js": APP_JS,
      }}
      options={{
        showLineNumbers: true,
      }}
    />
  );
}
