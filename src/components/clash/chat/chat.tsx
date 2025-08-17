"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([
    "Bienvenido al chat del Clash!",
    "Usa este espacio para coordinar con tu equipo.",
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, text]);
    setInput("");
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-2 border-b border-border text-xs text-muted-foreground">Chat</div>
      <div className="flex-1 overflow-auto p-2 space-y-1 text-sm">
        {messages.map((m, i) => (
          <div key={i} className="bg-muted/40 rounded px-2 py-1 w-fit max-w-[85%]">
            {m}
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-border flex gap-2">
        <input
          className="flex-1 bg-background border border-border rounded px-2 py-1 outline-none"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Button size="sm" onClick={send}>Enviar</Button>
      </div>
    </div>
  );
}
