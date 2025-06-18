function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Text copied to clipboard:', text);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function formatRegistrationCode(code) {
    const parts = code.match(/(\d{4})(\d{4})/);
    return parts ? `${parts[1]}-${parts[2]}` : code;
}

export { copyToClipboard, formatRegistrationCode };