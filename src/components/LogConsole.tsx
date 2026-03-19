import { useEffect, useRef } from "react";

interface Props {
  logs: string[];
  autoRefresh: boolean;
  onToggleRefresh: () => void;
}

export default function LogConsole({ logs, autoRefresh, onToggleRefresh }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoRefresh && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoRefresh]);

  return (
    <div className="flex flex-col h-[400px] bg-background cyber-border overflow-hidden relative">
      {/* Scanline overlay */}
      <div className="terminal-overlay absolute inset-0 z-10" />

      {/* Header */}
      <div className="flex justify-between items-center p-2 bg-secondary border-b border-border z-20">
        <span className="font-label text-[10px] text-muted-foreground">
          SYSTEM_LOGS.SH
        </span>
        <button
          onClick={onToggleRefresh}
          className={`font-label text-[10px] px-2 py-1 transition-colors duration-150 ${
            autoRefresh
              ? "bg-success/20 text-success"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {autoRefresh ? "● LIVE_SYNC" : "○ PAUSED"}
        </button>
      </div>

      {/* Log entries */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono-code text-xs scrollbar-thin z-20"
      >
        {logs.length === 0 ? (
          <span className="text-muted-foreground">AWAITING_DATA...</span>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              className="border-l-2 border-border pl-2 py-1 hover:bg-secondary/50 transition-colors duration-150"
            >
              <span className="text-primary/50 mr-2">
                [{String(i).padStart(4, "0")}]
              </span>
              <span className="text-foreground/80">{log}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
