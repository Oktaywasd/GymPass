import { useState } from "react";
import { startSession } from "../services/api";

export default function StartSession() {
  const [requestId, setRequestId] = useState("");
  const [message, setMessage] = useState("");

  const handleStart = async (e) => {
    e.preventDefault();
    try {
      const res = await startSession(requestId);
      setMessage("Session started!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to start session");
    }
  };

  return (
    <div>
      <h2>Start Session</h2>
      <form onSubmit={handleStart}>
        <input type="number" placeholder="Request ID" value={requestId} onChange={e => setRequestId(e.target.value)} required /><br />
        <button type="submit">Start</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
