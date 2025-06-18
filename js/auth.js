const apiUrl = '/api/auth';

async function fetchRegistrationCode() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const code = await response.text();
        displayRegistrationCode(code);
    } catch (error) {
        handleError(error);
    }
}

function displayRegistrationCode(code) {
    const codeDisplayElement = document.getElementById('registration-code');
    codeDisplayElement.textContent = code;
}

function handleError(error) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = `Error: ${error.message}`;
}

function copyToClipboard() {
    const codeDisplayElement = document.getElementById('registration-code');
    navigator.clipboard.writeText(codeDisplayElement.textContent)
        .then(() => {
            alert('Code copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
}

document.getElementById('fetch-code-button').addEventListener('click', fetchRegistrationCode);
document.getElementById('copy-code-button').addEventListener('click', copyToClipboard);