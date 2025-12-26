import { useState } from "react";
import { getActiveSession } from "../services/api";

export default function ActiveSession() {
  const [userId, setUserId] = useState("");
  const [session, setSession] = useState(null);

  const handleCheck = async () => {
    try {
      const res = await getActiveSession(userId);
      setSession(res);
    } catch (err) {
      console.error(err);
      setSession({ error: "No active session" });
    }
  };

  return (
    <div>
      <h2>Active Session</h2>
      <input type="number" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
      <button onClick={handleCheck}>Check</button>
      {session && <pre>{JSON.stringify(session, null, 2)}</pre>}
    </div>
  );
}

