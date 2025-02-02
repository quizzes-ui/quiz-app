import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const DBconnect = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);

    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            console.log('Attempting to authenticate and fetch quizzes...');
            
            // First authenticate
            try {
                const authData = await pb.admins.authWithPassword(
                    process.env.POCKETBASE_ADMIN_EMAIL,
                    process.env.POCKETBASE_ADMIN_PASSWORD
                );
                console.log('Authentication successful');
                setDebugInfo(prev => ({ ...prev, authStatus: 'success' }));
            } catch (authErr) {
                console.error('Authentication failed:', authErr);
                setDebugInfo(prev => ({ ...prev, authError: authErr.message }));
                throw new Error('Authentication failed: ' + authErr.message);
            }

            // Then fetch collections
            try {
                const collections = await pb.collections.getList(1, 50);
                console.log('Available collections:', collections);
                setDebugInfo(prev => ({ ...prev, collections }));
            } catch (collErr) {
                console.error('Error fetching collections:', collErr);
                setDebugInfo(prev => ({ ...prev, collectionsError: collErr.message }));
            }

            // Finally fetch quizzes
            const records = await pb.collection('quizzes').getFullList({
                sort: '-created',
            });
            
            console.log('Fetched quizzes:', records);
            setQuizzes(records);
            setDebugInfo(prev => ({ ...prev, quizzes: records }));
            setLoading(false);
        } catch (err) {
            console.error('Error details:', err);
            setError(err.message || 'Failed to load quizzes');
            setDebugInfo(prev => ({ ...prev, error: err }));
            setLoading(false);
        }
    };

    if (loading) return <div>Loading quizzes...</div>;
    if (error) return (
        <div>
            <div>Error: {error}</div>
            {debugInfo && (
                <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Debug Information:</h4>
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
            )}
        </div>
    );

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
