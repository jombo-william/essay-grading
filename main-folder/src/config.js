const configuredApiUrl = import.meta.env.VITE_API_URL;

const API_URL = (import.meta.env.DEV ? "" : configuredApiUrl || "https://jombo-essaygrade.fly.dev").replace(/\/$/, "");

export default API_URL;
