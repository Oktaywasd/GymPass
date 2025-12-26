import { useState } from "react";
import { getPaymentBySession, getUserPayments } from "../services/api";

export default function Payments() {
  const [sessionId, setSessionId] = useState("");
  const [userId, setUserId] = useState("");
  const [payment, setPayment] = useState(null);
  const [payments, setPayments] = useState(null);

  const handleGetPaymentBySession = async () => {
    try {
      const res = await getPaymentBySession(sessionId);
      setPayment(res);
    } catch (err) {
      console.error(err);
      setPayment({ error: "Payment not found" });
    }
  };

  const handleGetUserPayments = async () => {
    try {
      const res = await getUserPayments(userId);
      setPayments(res);
    } catch (err) {
      console.error(err);
      setPayments({ error: "No payments found" });
    }
  };

  return (
    <div>
      <h2>Payments</h2>

      <div>
        <h3>By Session</h3>
        <input type="number" placeholder="Session ID" value={sessionId} onChange={e => setSessionId(e.target.value)} />
        <button onClick={handleGetPaymentBySession}>Get Payment</button>
        {payment && <pre>{JSON.stringify(payment, null, 2)}</pre>}
      </div>

      <div>
        <h3>By User</h3>
        <input type="number" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
        <button onClick={handleGetUserPayments}>Get Payments</button>
        {payments && <pre>{JSON.stringify(payments, null, 2)}</pre>}
      </div>
    </div>
  );
}
