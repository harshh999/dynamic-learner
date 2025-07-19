import React, { useState, useEffect } from 'react';
import './App.css'; // Keep the CSS import

function App() {
  // State for skill and level selection
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  // State to store the fetched pathway
  const [pathway, setPathway] = useState([]);
  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // State to track current resource in the pathway (for future navigation)
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  // State for quiz submission message
  const [quizMessage, setQuizMessage] = useState('');

  // Function to fetch the learning pathway from the backend
  const fetchPathway = async () => {
    if (!selectedSkill || !selectedLevel) {
      setError("Please select both a skill and a level.");
      setPathway([]);
      return;
    }

    setLoading(true);
    setError(null);
    setPathway([]); // Clear previous pathway
    setCurrentResourceIndex(0); // Reset current resource index

    try {
      const response = await fetch(`http://localhost:5001/api/pathway?skill=${selectedSkill}&level=${selectedLevel}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPathway(data.pathway);
    } catch (error) {
      console.error("Error fetching pathway:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle quiz submission (simple for MVP)
  const handleQuizSubmit = async (quizId, questions) => {
    // For MVP, we'll just simulate an answer for the first question
    // In a real app, you'd get answers from user input
    const simulatedAnswers = questions.map(q => {
        if (q.q === "What does useState return?") return "Array";
        if (q.q === "What is the purpose of a custom hook?") return "Reusability";
        if (q.q === "Which is a mutable data type?") return "List";
        return "Incorrect"; // Default for other questions
    });


    setQuizMessage('Submitting quiz...');
    try {
      const response = await fetch('http://localhost:5001/api/quiz-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skill: selectedSkill,
          level: selectedLevel,
          quizId: quizId,
          answers: simulatedAnswers, // Sending simulated answers
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setQuizMessage(result.message);

      // If quiz was successful and there's a next resource suggested
      if (result.success && result.nextResourceId) {
          // Find the index of the next resource in the current pathway
          const nextIndex = pathway.findIndex(res => res.id === result.nextResourceId);
          if (nextIndex !== -1) {
              setCurrentResourceIndex(nextIndex);
          }
      } else if (result.success) {
          // If quiz was successful but no specific next resource, just move to next in sequence
          if (currentResourceIndex < pathway.length - 1) {
              setCurrentResourceIndex(currentResourceIndex + 1);
          } else {
              setQuizMessage("Pathway completed!");
          }
      }

    } catch (error) {
      console.error("Error submitting quiz:", error);
      setQuizMessage(`Error submitting quiz: ${error.message}`);
    }
  };

  // Function to mark a resource as complete and move to the next
  const handleResourceComplete = (index) => {
    if (index < pathway.length - 1) {
      setCurrentResourceIndex(index + 1);
      setQuizMessage(''); // Clear quiz message when moving on
    } else {
      setQuizMessage("Pathway completed!");
    }
  };


  // Render function
  return (
    <div className="App">
      <header className="App-header">
        <h1>Dynamic Learning Pathway Generator</h1>

        {/* Skill and Level Selection */}
        <div style={{ marginBottom: '20px' }}>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            style={{ marginRight: '10px', padding: '8px', borderRadius: '5px' }}
          >
            <option value="">Select Skill</option>
            <option value="react-hooks">React Hooks</option>
            <option value="python-basics">Python Basics</option>
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{ marginRight: '10px', padding: '8px', borderRadius: '5px' }}
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
          </select>
          <button
            onClick={fetchPathway}
            disabled={loading}
            style={{ padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}
          >
            {loading ? 'Loading...' : 'Generate Pathway'}
          </button>
        </div>

        {/* Display Loading, Error, or Pathway */}
        {loading && <p>Generating pathway...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {pathway.length > 0 && (
          <div style={{ textAlign: 'left', maxWidth: '600px', margin: '20px auto', border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
            <h2>Your Learning Pathway for {selectedSkill} ({selectedLevel})</h2>
            {pathway.map((resource, index) => (
              <div key={resource.id} style={{
                marginBottom: '15px',
                padding: '10px',
                border: '1px solid #eee',
                borderRadius: '8px',
                backgroundColor: index === currentResourceIndex ? '#e0f7fa' : '#f9f9f9', // Highlight current resource
                color: '#333',
                boxShadow: index === currentResourceIndex ? '0 2px 5px rgba(0,0,0,0.1)' : 'none'
              }}>
                <h3>{resource.title} ({resource.type})</h3>
                {resource.url && (
                  <p><a href={resource.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>Go to Resource</a></p>
                )}
                {resource.type === 'quiz' && (
                  <div>
                    {resource.questions.map((q, qIndex) => (
                        <div key={qIndex} style={{marginTop: '10px'}}>
                            <p><strong>Q{qIndex + 1}:</strong> {q.q}</p>
                            {/* For MVP, we're not taking actual input for answers, just simulating submission */}
                            <p style={{fontSize: '0.9em', color: '#666'}}>Options: {q.options.join(', ')}</p>
                        </div>
                    ))}
                    {index === currentResourceIndex && ( // Only show submit button for current quiz
                        <button
                            onClick={() => handleQuizSubmit(resource.id, resource.questions)}
                            style={{ marginTop: '10px', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white' }}
                        >
                            Submit Quiz (Simulated)
                        </button>
                    )}
                    {index === currentResourceIndex && quizMessage && <p style={{marginTop: '10px', fontWeight: 'bold'}}>{quizMessage}</p>}
                  </div>
                )}
                {resource.type !== 'quiz' && index === currentResourceIndex && ( // Only show complete button for current non-quiz resource
                    <button
                        onClick={() => handleResourceComplete(index)}
                        style={{ marginTop: '10px', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white' }}
                    >
                        Mark as Complete
                    </button>
                )}
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;