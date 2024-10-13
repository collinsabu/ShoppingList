// /app/register/page.js
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Add state for confirm password
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    if (password !== confirmPassword) {
      setError("Passwords do not match."); // Check if passwords match
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    // Handle success
    if (res.ok) {
      router.push("/login"); // Redirect to login page on success
    } else {
      try {
        // Check if the response contains a body to parse
        const errorData = await res.json();
        setError(errorData.error || "Registration failed.");
      } catch (err) {
        // Handle cases where the response body is empty or not JSON
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#9E7BB3] flex flex-col justify-center items-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">Register</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
          {/* Username Field */}
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

          {/* Password Field */}
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

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
