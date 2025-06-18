import React, { useState, useEffect } from 'react';

const CodeDisplay = () => {
    const [registrationCode, setRegistrationCode] = useState('');
    const [isReady, setIsReady] = useState(false);

    const fetchRegistrationCode = async () => {
        try {
            const response = await fetch('/api/auth');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text();
            setRegistrationCode(data);
            setIsReady(true);
        } catch (error) {
            console.error('Error fetching registration code:', error);
            setRegistrationCode('Error fetching code');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(registrationCode)
            .then(() => {
                alert('Code copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    useEffect(() => {
        fetchRegistrationCode();
    }, []);

    return (
        <div className="code-display">
            <h2>Registration Code</h2>
            <p>{registrationCode}</p>
            <button onClick={copyToClipboard} disabled={!isReady}>
                Copy Code
            </button>
            <button onClick={() => window.location.href = 'https://github.com/login/device'} disabled={!isReady}>
                Authenticate with Enterprise GitHub
            </button>
            {isReady && <p>Authentication is ready!</p>}
        </div>
    );
};

export default CodeDisplay;