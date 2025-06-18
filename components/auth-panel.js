import React, { useState, useEffect } from 'react';
import { fetchRegistrationCode } from '../js/auth';

const AuthPanel = () => {
    const [registrationCode, setRegistrationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchCode = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const code = await fetchRegistrationCode();
            setRegistrationCode(code);
        } catch (err) {
            setError('Failed to fetch registration code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(registrationCode)
            .then(() => alert('Code copied to clipboard!'))
            .catch(() => alert('Failed to copy code.'));
    };

    useEffect(() => {
        handleFetchCode();
    }, []);

    return (
        <div className="auth-panel">
            <h2>Authentication Panel</h2>
            {isLoading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {registrationCode && (
                <div>
                    <p>Your registration code: <strong>{registrationCode}</strong></p>
                    <button onClick={handleCopyCode}>Copy Code</button>
                    <a href="https://github.com/login/device" className="auth-button">Authenticate with Enterprise GitHub</a>
                </div>
            )}
        </div>
    );
};

export default AuthPanel;