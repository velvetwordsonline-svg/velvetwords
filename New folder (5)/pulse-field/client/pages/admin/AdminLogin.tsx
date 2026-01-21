import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Try to authenticate with backend first
      const response = await fetch('https://www.velvetwords.online/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        navigate('/admin/dashboard');
      } else {
        // Fallback to hardcoded check
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          const adminData = {
            id: '1',
            username: 'admin',
            email: 'admin@velvetwords.com'
          };
          
          localStorage.setItem('adminToken', 'admin-token-' + Date.now());
          localStorage.setItem('adminUser', JSON.stringify(adminData));
          navigate('/admin/dashboard');
        } else {
          setError('Invalid credentials. Use admin/admin123');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Fallback to hardcoded check
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const adminData = {
          id: '1',
          username: 'admin',
          email: 'admin@velvetwords.com'
        };
        
        localStorage.setItem('adminToken', 'admin-token-' + Date.now());
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        navigate('/admin/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full bg-[#050505] rounded-xl shadow-[0_0_30px_rgba(124,58,237,0.3)] border border-purple-600 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Velvet Words</h1>
          <p className="text-gray-300 mt-2">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-[0_0_15px_rgba(124,58,237,0.4)]"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-300">
          <p>Default credentials:</p>
          <p className="font-mono mt-1 text-purple-300">admin / admin123</p>
        </div>
      </div>
    </div>
  );
}