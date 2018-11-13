"use strict";
console.log('Script has loaded.');
// Register service worker to control making site work offline

if('serviceWorker' in navigator) {
    console.log("In if statement");
    navigator.serviceWorker
        .register('js/sw.js')
        .then(() =>  console.log('Service Worker Registered') );
}

const app = new Vue({
    el: "#app",
    data: {
        username: "",
        password: "",
    },
    methods: {

    }
});

var webAuth, loginBtn, logoutBtn, loginStatus, loginView, homeView,
    homeViewBtn;

window.addEventListener('load', function() {

    webAuth = new auth0.WebAuth({
        domain: '3123461.eu.auth0.com',
        clientID: 'ly140O3CwKr13wxzmHSGX1BWK4zi1cKI',
        responseType: 'token id_token',
        scope: 'openid',
        redirectUri: window.location.href
    });

    loginStatus = document.querySelector('.container h4');
    loginView = document.getElementById('login-view');
    homeView = document.getElementById('home-view');

    // buttons and event listeners
    homeViewBtn = document.getElementById('btn-home-view');
    loginBtn = document.getElementById('btn-login');
    logoutBtn = document.getElementById('btn-logout');

    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        webAuth.authorize();
    });

    homeViewBtn.addEventListener('click', function() {
        homeView.style.display = 'inline-block';
        loginView.style.display = 'none';
    });

    logoutBtn.addEventListener('click', logout);

    function handleAuthentication() {
        webAuth.parseHash(function(err, authResult) {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                setSession(authResult);
                loginBtn.style.display = 'none';
                homeView.style.display = 'inline-block';
            } else if (err) {
                homeView.style.display = 'inline-block';
                console.log(err);
                alert(
                    'Error: ' + err.error + '. Check the console for further details.'
                );
            }
            displayButtons();
        });
    }

    function setSession(authResult) {
        // Set the time that the Access Token will expire at
        var expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        );
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    function logout() {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        displayButtons();
    }

    function isAuthenticated() {
        // Check whether the current time is past the
        // Access Token's expiry time
        var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
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

    handleAuthentication();
});

