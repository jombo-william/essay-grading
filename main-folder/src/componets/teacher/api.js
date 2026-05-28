// src/components/teacher/api.js


const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://jombo-essaygrade.fly.dev'}/teacher`;


export async function apiFetch(path, options = {}) {
  const csrfToken = getCsrfToken();
  const authToken = getAuthToken();

  const routeMap = {
    '/get_assignments.php':     '/assignments',
    '/get_submissions.php':     '/submissions',
    '/get_pending_grading.php': '/submissions/pending',
    '/create_assignment.php':   '/assignments/create',
    '/update_assignment.php':   '/assignments/update',
    '/override_grade.php':      '/submissions/grade',
  };

  const cleanPath = path.startsWith('/') ? path : '/' + path;
  const mappedPath = routeMap[cleanPath] || cleanPath;
  const url = `${BASE_URL}${mappedPath}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

function getCsrfToken() {
  const cookieMatch = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
  return sessionStorage.getItem('csrf_token') || localStorage.getItem('csrf_token') || '';
}

function getAuthToken() {
  return sessionStorage.getItem('auth_token')
    || sessionStorage.getItem('session_token')
    || localStorage.getItem('session_token')
    || localStorage.getItem('auth_token')
    || localStorage.getItem('token')
    || '';
}

