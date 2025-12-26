import { useState } from "react";
import { endSession } from "../services/api";

export default function EndSession() {
  const [sessionId, setSessionId] = useState("");
  const [message, setMessage] = useState("");

  const handleEnd = async () => {
    try {
      const res = await endSession(sessionId);
      setMessage("Session ended!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to end session");
    }
  };

  return (
    <div>
      <h2>End Session</h2>
      <input type="number" placeholder="Session ID" value={sessionId} onChange={e => setSessionId(e.target.value)} />
      <button onClick={handleEnd}>End</button>
      {message && <p>{message}</p>}
    </div>
  );
}
