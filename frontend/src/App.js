import React, { useState, useEffect } from 'react'; // Import React, useState for state, and useEffect for side effects
import logo from './logo.svg'; // Keep the logo import
import './App.css'; // Keep the CSS import

function App() {
  // State to store the message fetched from the backend
  const [backendMessage, setBackendMessage] = useState('');
  // State to handle loading status
  const [loading, setLoading] = useState(true);
  // State to handle any errors during fetch
  const [error, setError] = useState(null);

  // useEffect hook runs after the component renders
  // The empty dependency array `[]` means it runs only once, like componentDidMount
  useEffect(() => {
    // Function to fetch data from the backend
    const fetchBackendData = async () => {
      try {
        // Make a GET request to your backend API endpoint
        // Remember your backend is running on port 5001
        const response = await fetch('http://localhost:5001/api/hello');

        // Check if the response was successful (status code 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Update the state with the message from the backend
        setBackendMessage(data.message);
      } catch (error) {
        // Catch any errors during the fetch operation
        console.error("Error fetching data:", error);
        setError(error.message); // Set the error message in state
      } finally {
        setLoading(false); // Set loading to false once fetch is complete (success or error)
      }
    };

    // Call the fetch function when the component mounts
    fetchBackendData();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {/* Display the backend message */}
        {loading ? (
          <p>Loading message from backend...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Error: {error}</p>
        ) : (
          <p>
            <strong>Backend Says:</strong> {backendMessage}
          </p>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;