import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const TARGET = "katyusha";

interface Props {
  onAuth: () => void;
}

export default function LoginScreen({ onAuth }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (value.length === TARGET.length) {
      if (value === TARGET) {
        localStorage.setItem("drippy_auth", "1");
        onAuth();
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
          setValue("");
        }, 600);
      }
    }
  }, [value, onAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-8 p-10"
      >
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-primary" />
          <span className="font-label text-xs text-muted-foreground">
            DRIPPY_AUTH_V1.0
          </span>
        </div>

        <h1 className="font-mono-code text-2xl font-bold text-foreground tracking-tight">
          SYSTEM_ACCESS
        </h1>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value.toLowerCase())}
              maxLength={TARGET.length}
              autoFocus
              className={`w-64 bg-card cyber-border px-4 py-3 font-mono-code text-center text-lg text-foreground outline-none transition-all duration-150 focus:cyber-glow-strong ${
                error ? "border-destructive animate-pulse" : ""
              }`}
              placeholder="••••••••"
            />
          </div>

          {/* Character indicator */}
          <div className="flex gap-1">
            {Array.from({ length: TARGET.length }).map((_, i) => (
              <div
                key={i}
                className={`h-1 w-6 transition-all duration-150 ${
                  i < value.length ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <span className="font-label text-[10px] text-muted-foreground">
            {error ? "ACCESS_DENIED" : "ENTER_PASSKEY"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
