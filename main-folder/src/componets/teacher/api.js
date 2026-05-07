const BASE_URL = 'http://localhost:8000/api/teacher';

export async function apiFetch(path, options = {}) {
  // Get token from localStorage - check all possible token names
  const token = localStorage.getItem('token') || 
                localStorage.getItem('session_token') || 
                localStorage.getItem('access_token');
  
  console.log('Token found:', token ? 'Yes' : 'No');
  
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

  // Handle query parameters
  let finalUrl = url;
  if (options.params) {
    const params = new URLSearchParams(options.params);
    finalUrl = `${url}?${params.toString()}`;
    delete options.params;
  }

  // Handle body
  let body = options.body;
  if (body && typeof body === 'object') {
    body = JSON.stringify(body);
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(finalUrl, {
    method: options.method || 'GET',
    headers: headers,
    credentials: 'include',
    body: body,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || data.detail || `Request failed (${response.status})`);
  }

  return data;
}
