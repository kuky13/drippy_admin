import { useState, useCallback } from "react";
import LoginScreen from "@/components/LoginScreen";
import Dashboard from "@/components/Dashboard";

export default function Index() {
  const [authed, setAuthed] = useState(() => localStorage.getItem("drippy_auth") === "1");

  const handleAuth = useCallback(() => setAuthed(true), []);
  const handleLogout = useCallback(() => setAuthed(false), []);

  if (!authed) return <LoginScreen onAuth={handleAuth} />;
  return <Dashboard onLogout={handleLogout} />;
}
