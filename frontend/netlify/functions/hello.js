    // netlify/functions/hello.js
    // This function handles requests to /api/hello

    // Import the Express framework
    const express = require('express');
    // Import the serverless-http library to wrap Express for serverless environments
    const serverless = require('serverless-http');
    // Import CORS to handle cross-origin requests
    const cors = require('cors');

    // Create an Express application instance
    const app = express();

    // Use CORS middleware to allow requests from your frontend
    app.use(cors());

    // Define the API endpoint for /api/hello
    // When a GET request comes to this function, it will respond with a JSON message
    app.get('/api/hello', (req, res) => {
      res.json({ message: 'Hello from Netlify Function!' });
    });

    // Export the handler function that Netlify will call
    // serverless(app) wraps your Express app into a serverless-compatible handler
    exports.handler = serverless(app);
    