    import React, { useState, useEffect } from 'react';
    // No need for App.css anymore as we'll use Tailwind
    // import './App.css';

    function App() {
      const [selectedSkill, setSelectedSkill] = useState('');
      const [selectedLevel, setSelectedLevel] = useState('');
      const [pathway, setPathway] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
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
        setQuizMessage(''); // Clear quiz message when generating new pathway

        try {
          // *** IMPORTANT: Using relative URL for Netlify deployment ***
          const response = await fetch(`/api/pathway?skill=${selectedSkill}&level=${selectedLevel}`);
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
        const simulatedAnswers = questions.map(q => {
            if (q.q === "What does useState return?") return "Array";
            if (q.q === "What is the purpose of a custom hook?") return "Reusability";
            if (q.q === "Which is a mutable data type?") return "List";
            return "Incorrect";
        });

        setQuizMessage('Submitting quiz...');
        try {
          // *** IMPORTANT: Using relative URL for Netlify deployment ***
          const response = await fetch('/api/quiz-submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              skill: selectedSkill,
              level: selectedLevel,
              quizId: quizId,
              answers: simulatedAnswers,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          setQuizMessage(result.message);

          if (result.success && result.nextResourceId) {
              const nextIndex = pathway.findIndex(res => res.id === result.nextResourceId);
              if (nextIndex !== -1) {
                  setCurrentResourceIndex(nextIndex);
              }
          } else if (result.success) {
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

      const handleResourceComplete = (index) => {
        if (index < pathway.length - 1) {
          setCurrentResourceIndex(index + 1);
          setQuizMessage('');
        } else {
          setQuizMessage("Pathway completed!");
        }
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl text-center backdrop-blur-sm bg-opacity-80 border border-gray-200">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6 tracking-tight">
              Dynamic Learning Pathway Generator
            </h1>

            {/* Skill and Level Selection */}
            <div className="mb-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full sm:w-auto"
              >
                <option value="">Select Skill</option>
                <option value="react-hooks">React Hooks</option>
                <option value="python-basics">Python Basics</option>
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full sm:w-auto"
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
              </select>
              <button
                onClick={fetchPathway}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {loading ? 'Generating...' : 'Generate Pathway'}
              </button>
            </div>

            {/* Display Loading, Error, or Pathway */}
            {loading && <p className="text-blue-600 font-medium text-lg">Generating pathway...</p>}
            {error && <p className="text-red-600 font-medium text-lg">Error: {error}</p>}

            {pathway.length > 0 && (
              <div className="mt-8 text-left bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Learning Pathway</h2>
                {pathway.map((resource, index) => (
                  <div
                    key={resource.id}
                    className={`mb-4 p-5 rounded-xl transition-all duration-300 ease-in-out transform ${
                      index === currentResourceIndex
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 shadow-md scale-100 border-l-4 border-blue-500'
                        : 'bg-white shadow-sm hover:shadow-md hover:scale-[1.01] border-l-4 border-transparent'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                      {resource.title}
                      <span className="ml-2 text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{resource.type.toUpperCase()}</span>
                    </h3>
                    {resource.url && (
                      <p className="mb-2">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Go to Resource
                        </a>
                      </p>
                    )}
                    {resource.type === 'quiz' && (
                      <div className="mt-3">
                        {resource.questions.map((q, qIndex) => (
                            <div key={qIndex} className="mb-2 p-3 bg-gray-100 rounded-lg">
                                <p className="font-semibold text-gray-700">Q{qIndex + 1}: {q.q}</p>
                                <p className="text-sm text-gray-500">Options: {q.options.join(', ')}</p>
                            </div>
                        ))}
                        {index === currentResourceIndex && (
                            <button
                                onClick={() => handleQuizSubmit(resource.id, resource.questions)}
                                className="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-200 ease-in-out transform hover:scale-105"
                            >
                                Submit Quiz (Simulated)
                            </button>
                        )}
                        {index === currentResourceIndex && quizMessage && <p className="mt-3 text-sm font-bold text-gray-700">{quizMessage}</p>}
                      </div>
                    )}
                    {resource.type !== 'quiz' && index === currentResourceIndex && (
                        <button
                            onClick={() => handleResourceComplete(index)}
                            className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105"
                        >
                            Mark as Complete
                        </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    export default App;
    