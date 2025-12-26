import React, { useState } from "react";
import { registerUser } from "../services/api";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ name, email, password });
            setMessage("Registration successful!");
        } catch (err) {
            setMessage("Registration failed.");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br/>
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
}
