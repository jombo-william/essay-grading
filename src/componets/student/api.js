// src/componets/student/api.js

const BASE_URL = 'http://localhost:8000'; // FastAPI backend

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || `Request failed (${res.status})`);
  }

  return data;
}



