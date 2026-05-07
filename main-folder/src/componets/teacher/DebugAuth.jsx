import { useState } from "react";

export default function DebugAuth() {
  const [info, setInfo] = useState({});
  
  const checkAuth = () => {
    const sessionToken = localStorage.getItem('session_token');
    const csrfToken = localStorage.getItem('csrf_token');
    const sessionToken2 = sessionStorage.getItem('session_token');
    
    setInfo({
      localStorage_session: sessionToken ? sessionToken.substring(0, 20) + '...' : 'Not found',
      localStorage_csrf: csrfToken ? csrfToken.substring(0, 20) + '...' : 'Not found',
      sessionStorage: sessionToken2 ? sessionToken2.substring(0, 20) + '...' : 'Not found'
    });
  };
  
  return (
    <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px', borderRadius: '8px' }}>
      <button onClick={checkAuth}>Check Auth Tokens</button>
      <pre style={{ fontSize: '11px', marginTop: '10px' }}>{JSON.stringify(info, null, 2)}</pre>
    </div>
  );
}
