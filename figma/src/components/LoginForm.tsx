import React, { useState } from 'react';

export default function LoginForm({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/cobrese/APEX/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Error de autenticación');
      }
    } catch (err) {
      setError('Error de red o del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Iniciar Sesión</h2>
      {error && <div className="mb-2 text-red-600 text-center">{error}</div>}
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
}
