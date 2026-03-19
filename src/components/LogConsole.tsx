import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

interface Props {
  logs: string[];
  autoRefresh: boolean;
  onToggleRefresh: () => void;
  onClearLogs: () => Promise<void>;
}

export default function LogConsole({ logs, autoRefresh, onToggleRefresh, onClearLogs }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [confirming, setConfirming] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (autoRefresh && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoRefresh]);

  const handleClear = async () => {
    setClearing(true);
    try {
      await onClearLogs();
    } catch {}
    setClearing(false);
    setConfirming(false);
  };

  return (
    <div className="flex flex-col h-[400px] bg-background cyber-border overflow-hidden relative">
      {/* Scanline overlay */}
      <div className="terminal-overlay absolute inset-0 z-10" />

      {/* Confirm overlay */}
      {confirming && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="cyber-border bg-secondary p-4 flex flex-col items-center gap-3 max-w-xs">
            <span className="font-label text-xs text-destructive font-bold">⚠ CONFIRM_DELETE</span>
            <span className="font-mono-code text-[11px] text-foreground/80 text-center">
              Tem certeza que deseja apagar todo o histórico de logs?
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                disabled={clearing}
                className="px-3 py-1.5 font-label text-[10px] font-bold bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors disabled:opacity-50"
              >
                {clearing ? "APAGANDO..." : "CONFIRMAR"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="px-3 py-1.5 font-label text-[10px] font-bold bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center p-2 bg-secondary border-b border-border z-20">
        <span className="font-label text-[10px] text-muted-foreground">
          SYSTEM_LOGS.SH
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfirming(true)}
            className="flex items-center gap-1 font-label text-[10px] px-2 py-1 bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors duration-150 border border-destructive/30"
          >
            <Trash2 size={10} /> LIMPAR
          </button>
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
