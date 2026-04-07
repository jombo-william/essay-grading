import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = "http://127.0.0.1:8000";

const styles = {
  panel: {
    marginTop: "24px",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    background: "#fff",
    boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 18px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8fafc",
  },
  title: { margin: 0, fontSize: "15px", fontWeight: 800, color: "#111827" },
  status: { fontSize: "12px", color: "#6b7280" },
  body: { padding: "16px 18px", maxHeight: "320px", overflowY: "auto", background: "#f9fafb" },
  messageRow: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" },
  messageBubble: isOwn => ({
    alignSelf: isOwn ? "flex-end" : "flex-start",
    maxWidth: "100%",
    padding: "12px 14px",
    borderRadius: "16px",
    background: isOwn ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#ffffff",
    color: isOwn ? "#ffffff" : "#111827",
    border: isOwn ? "none" : "1px solid #e5e7eb",
    boxShadow: isOwn ? "0 10px 30px rgba(99,102,241,0.2)" : "none",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  }),
  meta: { display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "11px", color: "#6b7280" },
  inputRow: { display: "flex", gap: "10px", padding: "16px 18px", borderTop: "1px solid #f1f5f9", background: "#fff" },
  textarea: { flex: 1, minHeight: "80px", padding: "12px 14px", borderRadius: "14px", border: "1px solid #e5e7eb", resize: "vertical", fontFamily: "inherit", fontSize: "13px", color: "#111827" },
  button: { minWidth: "96px", border: "none", borderRadius: "14px", padding: "12px 16px", fontWeight: 700, cursor: "pointer", background: "#4f46e5", color: "#fff" },
  empty: { color: "#6b7280", fontSize: "13px", margin: 0 },
};

function formatTime(isoString) {
  if (!isoString) return "";
  try {
    return new Date(isoString).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function ChatPanel({ submissionId, user }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("Connecting...");
  const socketRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (!submissionId || !user) return;

    const socket = io(BACKEND_URL, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
    });

    socketRef.current = socket;

    socket.on("connect", () => setStatus("Connected"));
    socket.on("disconnect", () => setStatus("Disconnected"));
    socket.on("connect_error", () => setStatus("Connection failed"));
    socket.on("new_message", message => setMessages(prev => [...prev, message]));

    socket.connect();
    socket.emit("join_submission", { submission_id: submissionId });

    fetch(`${BACKEND_URL}/api/chat/history/${submissionId}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setMessages(data.messages || []);
        }
      })
      .catch(() => {
        // ignore history load failures; socket may still work
      });

    return () => {
      socket.emit("leave_submission", { submission_id: submissionId });
      socket.disconnect();
      socket.off();
    };
  }, [submissionId, user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !socketRef.current || !socketRef.current.connected) return;

    socketRef.current.emit("send_message", {
      submission_id: submissionId,
      sender_id: user.id,
      sender_role: user.role || "student",
      sender_name: user.name || "Unknown",
      message: text,
    });

    setDraft("");
  };

  const handleKeyDown = event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div>
          <p style={styles.title}>Submission Chat</p>
          <p style={styles.status}>{status}</p>
        </div>
        <div style={styles.meta}>
          <span>{user.role === "teacher" ? "Teacher" : "Student"}</span>
          <span>Submission #{submissionId}</span>
        </div>
      </div>
      <div style={styles.body}>
        {messages.length === 0 ? (
          <p style={styles.empty}>No messages yet. Send the first note to start the conversation.</p>
        ) : (
          messages.map(message => {
            const isOwn = String(message.sender_id) === String(user.id);
            return (
              <div key={`${message.id}-${message.created_at}`} style={styles.messageRow}>
                <div style={styles.messageBubble(isOwn)}>
                  <div style={styles.meta}>
                    <span>{message.sender_name} ({message.sender_role})</span>
                    <span>{formatTime(message.created_at)}</span>
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "14px", lineHeight: "1.7" }}>{message.message}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
      <div style={styles.inputRow}>
        <textarea
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a quick message to the teacher / student..."
          style={styles.textarea}
        />
        <button type="button" onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}
