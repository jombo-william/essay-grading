// src/componets/teacher/api.js
const BASE_URL = 'http://127.0.0.1:8000/api/teacher';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  const routeMap = {
    '/get_assignments.php':     '/assignments',
    '/get_submissions.php':     '/submissions',
    '/get_pending_grading.php': '/submissions/pending',
    '/create_assignment.php':   '/assignments/create',
    '/update_assignment.php':   '/assignments/update',
    '/override_grade.php':      '/submissions/grade',
  };

  const cleanPath  = path.startsWith('/') ? path : '/' + path;
  const mappedPath = routeMap[cleanPath] || cleanPath;
  const url        = `${BASE_URL}${mappedPath}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    headers,
    credentials: 'include',
    ...options,
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || data.detail || `Request failed (${res.status})`);
  }

  return data;
}

function getToken(cookieName, localKey) {
  const cookieMatch = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + cookieName + '=([^;]+)')
  );
  if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
  return sessionStorage.getItem(cookieName) 
      || sessionStorage.getItem(localKey)
      || localStorage.getItem(localKey) 
      || '';
}