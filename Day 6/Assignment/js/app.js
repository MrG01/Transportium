"use strict";
console.log('Script has loaded.');
// Register service worker to control making site work offline

if('serviceWorker' in navigator) {
    console.log("In if statement");
    navigator.serviceWorker
        .register('js/sw.js')
        .then(() =>  console.log('Service Worker Registered') );
}

import AuthService from "./AuthService.js";

const auth = new AuthService()

const { login, logout, authenticated } = auth

const app = new Vue({
    el: "#app",
    data: {
        username: "",
        password: "",
        auth,
        authenticated
    },
    methods: {
        login,
        logout
    }
});