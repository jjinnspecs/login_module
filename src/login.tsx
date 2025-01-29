import React, { useState } from 'react';
import {Link} from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3002/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username , password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.error || 'An error occurred');
        setIsLoading(false);
        return;
      }

    // Handle successful login, retrieve the token
    const  data = await response.json();
    const token = data.token;
    const loggedInUsername = data.username; // Get the usernam from the response

    // Store the token in sessionStorage
    localStorage.setItem('authToken', token);

    // fetch user data
    fetchUserData(token);

    console.log('Login successful!');
    alert(`Welcome, ${loggedInUsername}!`);

    setIsLoading(false);
 

     window.location.href = '/landing_page'; // Redirect to Landing Page
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.');
      setIsLoading(false); 
    }
  };

  // Fetch the user data from the backend after login
const fetchUserData = async (token: string) => {
  try {
    const response = await fetch('http://localhost:3002/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();
    console.log('User data:', userData);
    // You can store this data in your state or context if needed
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your username, email, or phone number"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        {errorMessage && (
        <div className="text-red-500 mb-4">
          {errorMessage}
        </div>
      )}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-md"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <p className="mt-4">
          Don't have an account?{' '}
          <Link 
            to="/Signup" 
            className="text-blue-500 hover:underline"
          >
            Register here
          </Link>
        </p>
    </div>
  </div>
);
};

export default Login;