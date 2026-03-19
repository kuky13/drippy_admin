import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Cpu,
  HardDrive,
  Clock,
  RotateCcw,
  Square,
  Play,
  Terminal,
  Zap,
  LogOut,
} from "lucide-react";
import CyberCard from "./CyberCard";
import StatusBar from "./StatusBar";
import LogConsole from "./LogConsole";
import { fetchStatus, fetchLogs, sendControl } from "@/lib/api";

interface StatusData {
  status?: string;
  cpu?: number;
  memory?: number;
  uptime?: string | number;
}

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [status, setStatus] = useState<StatusData>({});
  const [logs, setLogs] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollStatus = useCallback(async () => {
    try {
      const data = await fetchStatus();
      setStatus(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const pollLogs = useCallback(async () => {
    try {
      const data = await fetchLogs();
      setLogs(Array.isArray(data) ? data : data?.logs ?? [String(data)]);
    } catch {}
  }, []);

  useEffect(() => {
    pollStatus();
    pollLogs();
    const sid = setInterval(pollStatus, 3000);
    return () => clearInterval(sid);
  }, [pollStatus, pollLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const lid = setInterval(pollLogs, 5000);
    return () => clearInterval(lid);
  }, [autoRefresh, pollLogs]);

  const handleControl = async (action: "restart" | "stop" | "start") => {
    setLoading(action);
    try {
      await sendControl(action);
      await pollStatus();
      await pollLogs();
    } catch {}
    setLoading(null);
  };

  const isOnline = status.status === "online" || status.status === "running";
  const cpuVal = status.cpu ?? 0;
  const memVal = status.memory ?? 0;

  const formatUptime = (v: string | number | undefined) => {
    if (!v) return "--:--:--";
    if (typeof v === "string") return v;
    const h = Math.floor(v / 3600);
    const m = Math.floor((v % 3600) / 60);
    const s = Math.floor(v % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const controls: { action: "restart" | "stop" | "start"; icon: typeof Play; label: string; variant: string }[] = [
    { action: "start", icon: Play, label: "INICIAR", variant: "bg-success/20 text-success hover:bg-success/30" },
    { action: "restart", icon: RotateCcw, label: "REINICIAR", variant: "bg-primary/20 text-primary hover:bg-primary/30" },
    { action: "stop", icon: Square, label: "PARAR", variant: "bg-destructive/20 text-destructive hover:bg-destructive/30" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-primary" />
          <h1 className="font-mono-code text-sm md:text-base font-bold text-foreground">
            DRIPPY_CMD <span className="text-muted-foreground">// V1.0</span>
          </h1>
        </div>
        <button
          onClick={() => { localStorage.removeItem("drippy_auth"); onLogout(); }}
          className="flex items-center gap-1 font-label text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <LogOut size={12} /> LOGOUT
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 cyber-border border-destructive/30 font-mono-code text-xs text-destructive">
          CONNECTION_ERROR: {error}
        </div>
      )}

      {/* Status Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
      >
        <CyberCard title="STATUS" icon={Activity}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-success animate-pulse" : "bg-destructive"}`} />
            <span className={`font-mono-code text-sm font-bold ${isOnline ? "text-success" : "text-destructive"}`}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
        </CyberCard>

        <CyberCard title="CPU" icon={Cpu}>
          <StatusBar label="USAGE" value={cpuVal} warning={cpuVal > 80} />
        </CyberCard>

        <CyberCard title="MEMÓRIA" icon={HardDrive}>
          <StatusBar label="USAGE" value={memVal} warning={memVal > 80} />
        </CyberCard>

        <CyberCard title="UPTIME" icon={Clock}>
          <span className="font-mono-code text-lg font-bold text-foreground">
            {formatUptime(status.uptime)}
          </span>
        </CyberCard>
      </motion.div>

      {/* Command Deck */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <CyberCard title="COMMAND_DECK" icon={Zap}>
          <div className="flex flex-wrap gap-3">
            {controls.map(({ action, icon: Icon, label, variant }) => (
              <motion.button
                key={action}
                whileTap={{ scale: 0.97, filter: "brightness(1.2)" }}
                disabled={loading !== null}
                onClick={() => handleControl(action)}
                className={`flex items-center gap-2 px-4 py-2 font-label text-xs font-bold transition-all duration-150 disabled:opacity-50 ${variant}`}
              >
                <Icon size={14} className={loading === action ? "animate-spin" : ""} />
                {loading === action ? "PROCESSING..." : label}
              </motion.button>
            ))}
          </div>
        </CyberCard>
      </motion.div>

      {/* Log Console */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CyberCard title="SYSTEM_LOGS" icon={Terminal} className="p-0">
          <LogConsole
            logs={logs}
            autoRefresh={autoRefresh}
            onToggleRefresh={() => setAutoRefresh(!autoRefresh)}
          />
        </CyberCard>
      </motion.div>
    </div>
  );
}
