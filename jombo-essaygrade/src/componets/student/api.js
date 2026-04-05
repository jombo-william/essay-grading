// // src/components/student/api.js

// //const BASE_URL = 'https://jombo-essaygrade.fly.dev/api/student';
// const BASE_URL = 'http://127.0.0.1:8000/api/student';

// export async function apiFetch(path, options = {}) {
//   const csrfToken = getCsrfToken();

//   // Map old PHP filenames to new Python routes
//   const routeMap = {
//     '/get_assignments.php': '/assignments',
//     '/get_results.php':     '/results',
//     '/submit_essay.php':    '/submit',
//     '/unsubmit_essay.php':  '/unsubmit',
//   };

//   const cleanPath = path.startsWith('/') ? path : '/' + path;
//   const mappedPath = routeMap[cleanPath] || cleanPath;
//   const url = `${BASE_URL}${mappedPath}`;

//   const res = await fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
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

// // Reads csrf_token from cookie first, then falls back to sessionStorage
// function getCsrfToken() {
//   const cookieMatch = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
//   if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
//   return sessionStorage.getItem('csrf_token') || '';
// }






const BASE_URL = 'http://127.0.0.1:8000/api/student'; // ← FIXED

export async function apiFetch(path, options = {}) {
  const csrfToken = getToken('csrf_token', 'token');

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
      'Content-Type': 'application/json',
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

// Read from cookie first, then localStorage
function getToken(cookieName, localKey) {
  const cookieMatch = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + cookieName + '=([^;]+)')
  );
  if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
  return localStorage.getItem(localKey) || '';
}
