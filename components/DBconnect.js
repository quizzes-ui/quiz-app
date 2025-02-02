import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const DBconnect = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const pb = new PocketBase('https://quiz-db.pikapod.net');

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            // Fetch all quizzes from the database
            const records = await pb.collection('quizzes').getFullList({
                sort: '-created', // Sort by creation date, newest first
            });
            
            setQuizzes(records);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching quizzes:', err);
            setError('Failed to load quizzes');
            setLoading(false);
        }
    };

    if (loading) return <div>Loading quizzes...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Available Quizzes</h2>
            <div className="quiz-list">
                {quizzes.map((quiz) => (
                    <div key={quiz.id} className="quiz-item">
                        <h3>{quiz.title}</h3>
                        <p>{quiz.description}</p>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .quiz-list {
                    display: grid;
                    gap: 1rem;
                    padding: 1rem;
                }
                .quiz-item {
                    border: 1px solid #eaeaea;
                    border-radius: 8px;
                    padding: 1rem;
                    background: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                h2 {
                    text-align: center;
                    margin-bottom: 1rem;
                }
                h3 {
                    margin: 0 0 0.5rem 0;
                }
                p {
                    margin: 0;
                    color: #666;
                }
            `}</style>
        </div>
    );
};

export default DBconnect;
