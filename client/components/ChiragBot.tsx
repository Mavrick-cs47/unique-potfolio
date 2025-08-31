import { useEffect, useRef, useState } from "react";

const FAQ: Record<string, string> = {
  "best project": "My AI Assistant Platform combining real-time inference, tools, and delightful UI.",
  "skills": "TypeScript, React, Three.js, Node, Tailwind, Framer Motion, and strong product thinking.",
  "hire": "I move fast, communicate clearly, and ship polished experiences that feel like magic.",
};

type Msg = { role: 'user' | 'bot'; text: string };

export default function ChiragBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'bot', text: 'Hi! I\'m ChiragBot. Ask me about projects, skills, or why hire me.' }]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const ask = (q: string) => {
    const lower = q.toLowerCase();
    const key = Object.keys(FAQ).find((k) => lower.includes(k));
    const answer = key ? FAQ[key] : "Great question! My top project is the AI Assistant Platform, and I\'m strong in TypeScript, React, and 3D on the web. Want links?";
    setMsgs((m) => [...m, { role: 'user', text: q }, { role: 'bot', text: answer }]);
  };

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {open && (
        <div className="glass neon-border w-[320px] h-[380px] rounded-2xl p-4 flex flex-col">
          <div className="font-semibold mb-2">ChiragBot</div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {msgs.map((m,i) => (
              <div key={i} className={`${m.role==='bot' ? 'bg-white/10' : 'bg-white/5'} p-2 rounded`}>{m.text}</div>
            ))}
            <div ref={endRef} />
          </div>
          <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!input.trim()) return; ask(input.trim()); setInput(''); }}>
            <input value={input} onChange={(e)=>setInput(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/20 outline-none" placeholder="Ask ChiragBot..." />
            <button className="btn-neon px-4">Ask</button>
          </form>
        </div>
      )}
      <button className="btn-neon" onClick={() => setOpen((v) => !v)}>{open ? 'Close ChiragBot' : 'Chat with ChiragBot'}</button>
    </div>
  );
}
