// src/components/teacher/api.js

const BASE_URL = 'http://localhost:8000/api/teachers';

export async function apiFetch(path, options = {}) {
  const csrfToken = getCsrfToken();

  // Map old PHP filenames to new Python routes
  const routeMap = {
    '/get_assignments.php':    '/assignments',
    '/get_submissions.php':    '/submissions',
    '/get_pending_grading.php':'/submissions/pending',
    '/create_assignment.php':  '/assignments/create',
    '/update_assignment.php':  '/assignments/update',
    '/override_grade.php':     '/submissions/grade',
    '/messages':               '/messages',
    '/send-message':           '/send-message',
  };

  const cleanPath = path.startsWith('/') ? path : '/' + path;
  const mappedPath = routeMap[cleanPath] || cleanPath;
  const url = `${BASE_URL}${mappedPath}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error(`Failed to parse response: ${res.statusText || 'Unknown error'}`);
  }

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || `Request failed (${res.status})`);
  }

  return data;
}

// Reads csrf_token from cookie first, then falls back to sessionStorage
function getCsrfToken() {
  const cookieMatch = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
  return sessionStorage.getItem('csrf_token') || '';
}