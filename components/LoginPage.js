// /app/login/page.js
'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaShoppingCart } from 'react-icons/fa';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Use NextAuth signIn function
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res.ok) {
      router.push('/'); // Redirect to homepage on success
    } else {
      setError(res.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#9E7BB3] flex flex-col justify-center items-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">Login</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
      <div className="mt-6">
        <FaShoppingCart size={50} className="text-purple-600" />
      </div>
    </div>
  );
};

export default LoginPage;
