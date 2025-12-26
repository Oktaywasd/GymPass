import React, { useState } from "react";
import { startSession, getActiveSession, endSession } from "../services/api";

export default function TestSession() {
    const [session, setSession] = useState(null);

    const handleStart = async () => {
        await startSession(1); // requestId = 1
        const active = await getActiveSession(1);
        setSession(active);
    };

    const handleEnd = async () => {
        if(session) {
            const ended = await endSession(session.id);
            setSession(ended);
        }
    };

    return (
        <div>
            <button onClick={handleStart}>Start Session</button>
            <button onClick={handleEnd}>End Session</button>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    );
}
