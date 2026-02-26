export {
    logError,
    logSuccess,
}

function logError(errorMessage) {
    return `Error: ${errorMessage}.`;
}
function logSuccess(successMessage) {
    return `Success: ${successMessage}!`;
}