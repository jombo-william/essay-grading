

const BASE_URL = 'http://127.0.0.1:8000/api/student';

export async function apiFetch(path, options = {}) {
  const csrfToken    = getToken('csrf_token', 'token');
  const sessionToken = getToken('session_token', 'session_token');  // ← ADD THIS

  const routeMap = {
    '/get_assignments.php': '/assignments',
    '/get_results.php':     '/results',
    '/submit_essay.php':    '/submit',
    '/unsubmit_essay.php':  '/unsubmit',
  };

  const cleanPath  = path.startsWith('/') ? path : '/' + path;
  const mappedPath = routeMap[cleanPath] || cleanPath;
  const url        = `${BASE_URL}${mappedPath}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type':  'application/json',
      ...(csrfToken    ? { 'X-CSRF-Token':  csrfToken    } : {}),
      ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {}),  // ← ADD THIS
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