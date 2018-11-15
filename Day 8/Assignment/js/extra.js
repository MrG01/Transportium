loginStatus = document.querySelector('.container h4');
loginView = document.getElementById('login-view');
homeView = document.getElementById('home-view');

logoutBtn = document.getElementById('btn-logout');
homeViewBtn = document.getElementById('btn-home-view');

homeViewBtn.addEventListener('click', function() {
    homeView.style.display = 'inline-block';
    loginView.style.display = 'none';
});

logoutBtn.addEventListener('click', logout);

function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
}

function displayButtons() {
    if (isAuthenticated()) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        loginStatus.innerHTML = 'You are logged in!';
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        loginStatus.innerHTML =
            'You are not logged in! Please log in to continue.';
    }
}