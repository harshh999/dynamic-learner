    // netlify/functions/quiz-submit.js
    // This function handles requests to /api/quiz-submit

    const express = require('express');
    const serverless = require('serverless-http');
    const cors = require('cors');

    const app = express();
    app.use(cors());
    app.use(express.json()); // Essential for parsing JSON request bodies

    // Define the API endpoint for /api/quiz-submit
    app.post('/api/quiz-submit', (req, res) => {
        // When using serverless-http, req.body is automatically populated for POST requests
        const { skill, level, quizId, answers } = req.body;

        console.log(`Quiz ${quizId} submitted for ${skill} (${level}) with answers:`, answers);

        // Simple logic: if it's the 'Basic useState' quiz and answers are "correct" (simulated)
        if (quizId === "rh103_q" && answers && answers[0] === "Array") {
            const nextResourceId = "rh104_v"; // Hardcode next resource ID
            res.json({ success: true, message: "Quiz submitted successfully!", nextResourceId: nextResourceId });
        } else if (quizId === "rh203_q" && answers && answers[0] === "Reusability") {
             const nextResourceId = "rh204_a"; // Hardcode next resource ID
             res.json({ success: true, message: "Quiz submitted successfully!", nextResourceId: nextResourceId });
        }
        else {
            res.json({ success: false, message: "Quiz submitted. Consider reviewing the previous material." });
        }
    });

    // Export the handler function
    exports.handler = serverless(app);
    