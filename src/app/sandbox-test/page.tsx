import { SandpackDemo } from "@/components/SandpackDemo";

export default function SandboxTestPage() {
  return (
    <main>
      <h1>Sandpack検証</h1>
      <p>コードを編集すると右側のプレビューがその場で更新されます。</p>
      <SandpackDemo />
    </main>
  );
}
