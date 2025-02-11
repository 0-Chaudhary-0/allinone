// Save the token to localStorage if it exists
document.addEventListener('DOMContentLoaded', function() {
    var tokenElement = document.getElementById('jwt-token');
    if (tokenElement) {
        var token = tokenElement.textContent;
        if (token) {
            localStorage.setItem('token', token);
        }
    }
});