

// const BASE_URL = 'http://127.0.0.1:8000/api/teacher';

// export async function apiFetch(path, options = {}) {
//   const csrfToken    = getToken('csrf_token', 'token');
//   const sessionToken = getToken('session_token', 'session_token');

//   // TEMPORARY DEBUG - remove after fixing
//   console.log('=== apiFetch debug ===');
//   console.log('sessionToken:', sessionToken);
//   console.log('csrfToken:', csrfToken);
//   console.log('localStorage session_token:', localStorage.getItem('session_token'));
//   console.log('localStorage token:', localStorage.getItem('token'));
//   console.log('=== end debug ===');

//   const routeMap = {
//     '/get_assignments.php':     '/assignments',
//     '/get_submissions.php':     '/submissions',
//     '/get_pending_grading.php': '/submissions/pending',
//     '/create_assignment.php':   '/assignments/create',
//     '/update_assignment.php':   '/assignments/update',
//     '/override_grade.php':      '/submissions/grade',
//   };

//   const cleanPath  = path.startsWith('/') ? path : '/' + path;
//   const mappedPath = routeMap[cleanPath] || cleanPath;
//   const url        = `${BASE_URL}${mappedPath}`;

//   const res = await fetch(url, {
//     headers: {
//       'Content-Type':  'application/json',
//       ...(csrfToken    ? { 'X-CSRF-Token':   csrfToken    } : {}),
//       ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {}),
//       ...(options.headers || {}),
//     },
//     credentials: 'include',
//     ...options,
//   });

//   const data = await res.json();

//   if (!res.ok || data.success === false) {
//     throw new Error(data.message || `Request failed (${res.status})`);
//   }

//   return data;
// }

// function getToken(cookieName, localKey) {
//   const cookieMatch = document.cookie.match(
//     new RegExp('(?:^|;\\s*)' + cookieName + '=([^;]+)')
//   );
//   if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
//   return localStorage.getItem(localKey) || '';
// }






const BASE_URL = 'http://127.0.0.1:8000/api/teacher';

export async function apiFetch(path, options = {}) {
  const csrfToken    = getToken('csrf_token', 'token');
  const sessionToken = getToken('session_token', 'session_token');

  // TEMPORARY DEBUG - remove after fixing
  console.log('=== apiFetch debug ===');
  console.log('sessionToken:', sessionToken);
  console.log('csrfToken:', csrfToken);
  console.log('localStorage session_token:', localStorage.getItem('session_token'));
  console.log('localStorage token:', localStorage.getItem('token'));
  console.log('=== end debug ===');

  const routeMap = {
    // ── Legacy PHP → FastAPI mappings (kept for backward compat) ──────────
    '/get_assignments.php':     '/assignments',
    '/get_submissions.php':     '/submissions',
    '/get_pending_grading.php': '/submissions/pending',
    '/create_assignment.php':   '/assignments/create',
    '/update_assignment.php':   '/assignments/update',
    '/override_grade.php':      '/submissions/grade',

    // ── Class routes ──────────────────────────────────────────────────────
    '/api/teacher/classes':         '/classes',
    '/api/teacher/classes/create':  '/classes/create',
    '/api/teacher/classes/update':  '/classes/update',
    '/api/teacher/classes/delete':  '/classes/delete',
  };

  const cleanPath  = path.startsWith('/') ? path : '/' + path;
  const mappedPath = routeMap[cleanPath] || cleanPath;
  const url        = `${BASE_URL}${mappedPath}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type':  'application/json',
      ...(csrfToken    ? { 'X-CSRF-Token':  csrfToken    } : {}),
      ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {}),
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
  return localStorage.getItem(localKey) || '';
}