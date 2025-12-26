import axios from "axios";

export const BASE_URL = "http://localhost:8080";

export const startSession = async (requestId) => {
    const response = await fetch(`${BASE_URL}/sessions/start?requestId=${requestId}`, { method: "POST" });
    return response.json();
};

export const getActiveSession = async (userId) => {
    const response = await fetch(`${BASE_URL}/sessions/active?userId=${userId}`);
    return response.json();
};

export const endSession = async (sessionId) => {
    const response = await fetch(`${BASE_URL}/sessions/${sessionId}/end`, { method: "POST" });
    return response.json();
};

export const getPaymentBySession = async (sessionId) => {
    const response = await fetch(`${BASE_URL}/payments/session/${sessionId}`);
    return response.json();
};

export const getUserPayments = async (userId) => {
    const response = await fetch(`${BASE_URL}/payments/user/${userId}`);
    return response.json();
};

export const registerUser = async (user) => {
    await axios.post(`${BASE_URL}/auth/register`, user);
};

export const loginUser = async (credentials) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, credentials);
    return res.data;
};
