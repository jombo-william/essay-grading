const configuredApiUrl = import.meta.env.VITE_API_URL;

const API_URL = (configuredApiUrl || "http://127.0.0.1:8000").replace(/\/$/, "");

export default API_URL;
