const API_BASE = "http://31.97.168.87:4000";
const AUTH_TOKEN = "katyusha";

const headers = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

export async function fetchStatus() {
  const res = await fetch(`${API_BASE}/status`, { headers });
  if (!res.ok) throw new Error(`STATUS_ERR_${res.status}`);
  return res.json();
}

export async function fetchLogs() {
  const res = await fetch(`${API_BASE}/logs`, { headers });
  if (!res.ok) throw new Error(`LOGS_ERR_${res.status}`);
  return res.json();
}

export async function sendControl(action: "restart" | "stop" | "start") {
  const res = await fetch(`${API_BASE}/control`, {
    method: "POST",
    headers,
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error(`CONTROL_ERR_${res.status}`);
  return res.json();
}
