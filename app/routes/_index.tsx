import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "⚡️ GitHub Issues" },
    { name: "description", content: "Choo Choo!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>🚇</h1>
    </div>
  );
}
