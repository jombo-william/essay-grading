
<<<<<<< HEAD
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/teacher`;

// Mock data for development/fallback when API fails
const MOCK_DATA = {
  '/assignments': {
    assignments: [
      { id: 1, title: "Introduction to Essay Writing", description: "Write a basic essay", instructions: "Write 500 words...", max_score: 100, due_date: new Date(Date.now() + 7*24*60*60*1000).toISOString(), is_active: true, rubric: { content: 40, structure: 30, grammar: 20, vocabulary: 10 } },
      { id: 2, title: "Argumentative Essay", description: "Take a stance", instructions: "Write 800 words...", max_score: 100, due_date: new Date(Date.now() + 14*24*60*60*1000).toISOString(), is_active: true, rubric: { content: 40, structure: 30, grammar: 20, vocabulary: 10 } },
    ]
  },
  '/submissions': {
    submissions: [
      { id: 1, assignment_id: 1, student_id: 101, student_name: "John Doe", student_email: "john@example.com", essay_text: "Sample essay...", status: "submitted", submitted_at: new Date().toISOString(), max_score: 100 },
      { id: 2, assignment_id: 2, student_id: 102, student_name: "Jane Smith", student_email: "jane@example.com", essay_text: "Another essay...", status: "ai_graded", ai_score: 78, ai_detection_score: 25, submitted_at: new Date().toISOString(), max_score: 100 },
    ]
  },
  '/submissions/pending': {
    submissions: []
  }
};

// Store auth token globally
let authToken = null;

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    sessionStorage.setItem('auth_token', token);
    sessionStorage.setItem('session_token', token);
  } else {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('session_token');
  }
}

export async function apiFetch(path, options = {}) {
  const csrfToken = getCsrfToken();
  const storedToken = getAuthToken();

  console.log('API Fetch:', path, 'Has Token:', !!storedToken, 'Has CSRF:', !!csrfToken);
=======

// const BASE_URL = 'http://127.0.0.1:8000/api/teacher';
const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/teacher`;

export async function apiFetch(path, options = {}) {
  const csrfToken    = getToken('csrf_token', 'token');
  const sessionToken = getToken('session_token', 'session_token');

   console.log('csrfToken:', csrfToken);        // ← ADD THIS
  console.log('sessionToken:', sessionToken);  // ← ADD THIS
>>>>>>> f9a70ba45be21c52cb98854e36c9e948af32002e

  const routeMap = {
    // ── Legacy PHP → FastAPI mappings (kept for backward compat) ──────────
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

<<<<<<< HEAD
  console.log('Fetching URL:', url);
=======
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
>>>>>>> f9a70ba45be21c52cb98854e36c9e948af32002e

  // For GET requests, you can use mock data as fallback
  const isGetRequest = !options.method || options.method === 'GET';
  
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(storedToken && { 'Authorization': `Bearer ${storedToken}` }),
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        ...(options.headers || {}),
      },
      credentials: 'include',
      ...options,
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      let errorMessage = `Request failed (${res.status})`;
      try {
        const data = await res.json();
        errorMessage = data.message || data.error || errorMessage;
      } catch (e) {
        const text = await res.text();
        console.error('Error response:', text);
      }
      
      // If authentication failed (401/403) and we have mock data, use it as fallback
      if ((res.status === 401 || res.status === 403) && isGetRequest && MOCK_DATA[mappedPath]) {
        console.warn('Using mock data as fallback for:', mappedPath);
        return MOCK_DATA[mappedPath];
      }
      
      throw new Error(errorMessage);
    }

    const data = await res.json();
    
    if (data.success === false) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Fallback to mock data for GET requests when network fails
    if (isGetRequest && MOCK_DATA[mappedPath]) {
      console.warn('Network error, using mock data for:', mappedPath);
      return MOCK_DATA[mappedPath];
    }
    
    throw error;
  }
}

<<<<<<< HEAD
function getCsrfToken() {
  // Try to get from cookie
  const cookieMatch = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
  
  // Try session storage
  const sessionToken = sessionStorage.getItem('csrf_token');
  if (sessionToken) return sessionToken;
  
  // Try localStorage
  const localToken = localStorage.getItem('csrf_token');
  if (localToken) return localToken;
  
  return '';
}

function getAuthToken() {
  return authToken
    || sessionStorage.getItem('auth_token')
    || sessionStorage.getItem('session_token')
    || localStorage.getItem('session_token')
    || localStorage.getItem('auth_token')
    || localStorage.getItem('token')
    || '';
}

// Helper function to check if user is authenticated
export async function checkAuth() {
  try {
    const result = await apiFetch('/auth/check');
    return result.authenticated === true;
  } catch (error) {
    return false;
  }
}

// Helper function to logout
export async function logout() {
  setAuthToken(null);
  sessionStorage.clear();
  localStorage.removeItem('csrf_token');
  document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
=======



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
>>>>>>> f9a70ba45be21c52cb98854e36c9e948af32002e
