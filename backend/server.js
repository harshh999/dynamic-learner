const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001; // Ensure this is 5001

app.use(cors());
app.use(express.json());

// --- Hardcoded Learning Pathway Data ---
// This simulates your "knowledge base" and adaptive logic for the MVP
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

// --- API Endpoints ---

// Existing test endpoint
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Backend!' });
});

// New endpoint to get a learning pathway
// Example usage: http://localhost:5001/api/pathway?skill=react-hooks&level=beginner
app.get('/api/pathway', (req, res) => {
    const { skill, level } = req.query; // Get skill and level from query parameters

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

// New endpoint to simulate quiz submission and get next resource (simple logic for MVP)
app.post('/api/quiz-submit', (req, res) => {
    const { skill, level, quizId, answers } = req.body;

    // In a real app, you'd validate answers against stored quiz data
    // For MVP, let's assume a simple pass/fail or just return a generic next step
    console.log(`Quiz ${quizId} submitted for ${skill} (${level}) with answers:`, answers);

    // Simple logic: if it's the 'Basic useState' quiz and answers are "correct" (simulated)
    if (quizId === "rh103_q" && answers && answers[0] === "Array") {
        // Simulate recommending the next resource in the sequence for beginner React Hooks
        const nextResourceId = "rh104_v"; // Hardcode next resource ID
        res.json({ success: true, message: "Quiz submitted successfully!", nextResourceId: nextResourceId });
    } else if (quizId === "rh203_q" && answers && answers[0] === "Reusability") {
         const nextResourceId = "rh204_a"; // Hardcode next resource ID
         res.json({ success: true, message: "Quiz submitted successfully!", nextResourceId: nextResourceId });
    }
    else {
        // For any other quiz or "incorrect" answer, you might recommend re-doing the current topic or a remedial one
        res.json({ success: false, message: "Quiz submitted. Consider reviewing the previous material." });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});