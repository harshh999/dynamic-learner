    // netlify/functions/pathway.js
    // This function handles requests to /api/pathway

    const express = require('express');
    const serverless = require('serverless-http');
    const cors = require('cors');

    const app = express();
    app.use(cors());
    app.use(express.json()); // Needed if you plan to send JSON in requests (though not for GET /pathway)

    // --- Hardcoded Learning Pathway Data (Copied from your backend/server.js) ---
    const learningPathways = {
        "react-hooks": {
            "beginner": [
                { id: "rh101_v", type: "video", title: "Introduction to React Hooks", url: "https://example.com/react-hooks-intro-video" },
                { id: "rh102_a", type: "article", title: "Understanding useState Hook", url: "https://example.com/understanding-usestate" },
                { id: "rh103_q", type: "quiz", title: "Quiz: Basic useState", questions: [
                    { q: "What does useState return?", options: ["Array", "Object"], answer: "Array" }
                ]},
                { id: "rh104_v", type: "video", title: "Deep Dive into useEffect", url: "https://example.com/deep-dive-useeffect-video" },
                { id: "rh105_a", type: "article", title: "Rules of Hooks", url: "https://example.com/rules-of-hooks" },
            ],
            "intermediate": [
                { id: "rh201_a", type: "article", title: "Custom Hooks: Building Reusable Logic", url: "https://example.com/custom-hooks-guide" },
                { id: "rh202_v", type: "video", title: "useContext for State Management", url: "https://example.com/usecontext-video" },
                { id: "rh203_q", type: "quiz", title: "Quiz: Intermediate Hooks", questions: [
                    { q: "What is the purpose of a custom hook?", options: ["Reusability", "Performance"], answer: "Reusability" }
                ]},
                { id: "rh204_a", type: "article", title: "useReducer for Complex State", url: "https://example.com/usereducer-complex-state" },
            ],
        },
        "python-basics": {
            "beginner": [
                { id: "pb101_v", type: "video", title: "Python Setup & First Program", url: "https://example.com/python-setup-video" },
                { id: "pb102_a", type: "article", title: "Variables and Data Types in Python", url: "https://example.com/python-variables" },
                { id: "pb103_q", type: "quiz", title: "Quiz: Python Data Types", questions: [
                    { q: "Which is a mutable data type?", options: ["Tuple", "List"], answer: "List" }
                ]},
            ],
        }
    };

    // Define the API endpoint for /api/pathway
    // Netlify Functions receive query parameters in event.queryStringParameters
    app.get('/api/pathway', (req, res) => {
        // When using serverless-http, req.query is automatically populated
        const { skill, level } = req.query;

        if (!skill || !level) {
            return res.status(400).json({ error: "Skill and level parameters are required." });
        }

        const skillData = learningPathways[skill.toLowerCase()];
        if (!skillData) {
            return res.status(404).json({ error: `No pathways found for skill: ${skill}` });
        }

        const pathway = skillData[level.toLowerCase()];
        if (!pathway) {
            return res.status(404).json({ error: `No ${level} pathway found for skill: ${skill}` });
        }

        res.json({ skill, level, pathway });
    });

    // Export the handler function
    exports.handler = serverless(app);
    