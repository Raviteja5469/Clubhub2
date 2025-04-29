// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        console.log('Login successful');
        setSuccessMessage('Logged in successfully!'); // Set success message
        setIsLoggedIn(true); // Update state to indicate logged in

        // Redirect to dashboard after a short delay to show the message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500); // Redirect after 1.5 seconds
      } else {
        // Login failed
        console.error('Login failed:', data.message);
        setError(data.message || 'Login failed'); // Display error message from backend
      }
    } catch (err) {
      console.error('Error during login fetch:', err);
      setError('An error occurred. Please try again.'); // Display a generic error message for fetch issues
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(''); // Clear error on input change
              setSuccessMessage(''); // Clear success on input change
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(''); // Clear error on input change
              setSuccessMessage(''); // Clear success on input change
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Display Error Message */}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {/* Display Success Message */}
        {successMessage && <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>}

        <button
          type="submit"
          className="btn btn-primary w-full flex justify-center items-center py-2 rounded-md"
          disabled={successMessage} // Disable button if success message is shown (waiting for redirect)
        >
          {successMessage ? 'Redirecting...' : 'Login'}
        </button>
      </form>
    </div>
  );
}