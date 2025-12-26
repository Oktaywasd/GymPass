import React, { useState } from "react";
import { loginUser } from "../services/api";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await loginUser({ email, password });
            setUser(user);
            setMessage("Login successful!");
        } catch (err) {
            setMessage("Login failed.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
}
