"use strict";

var _AuthService = _interopRequireDefault(require("./AuthService.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('Script has loaded.'); // Register service worker to control making site work offline

if ('serviceWorker' in navigator) {
  console.log("In if statement");
  navigator.serviceWorker.register('js/sw.js').then(function () {
    return console.log('Service Worker Registered');
  });
}

var auth = new _AuthService.default();
var login = auth.login,
    logout = auth.logout,
    authenticated = auth.authenticated;
var app = new Vue({
  el: "#app",
  data: {
    username: "",
    password: "",
    auth: auth,
    authenticated: authenticated
  },
  methods: {
    login: login,
    logout: logout
  }
});
//# sourceMappingURL=app.js.map