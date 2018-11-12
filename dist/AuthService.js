"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _auth0Variables = require("./auth0-variables.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AuthService =
/*#__PURE__*/
function () {
  function AuthService() {
    _classCallCheck(this, AuthService);

    _defineProperty(this, "authenticated", this.isAuthenticated());

    _defineProperty(this, "auth0", new auth0.WebAuth({
      domain: _auth0Variables.AUTH_CONFIG.domain,
      clientID: _auth0Variables.AUTH_CONFIG.clientId,
      redirectUri: _auth0Variables.AUTH_CONFIG.callbackUrl,
      responseType: 'token id_token',
      scope: 'openid'
    }));

    this.login = this.login.bind(this);
    this.setSession = this.setSession.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  _createClass(AuthService, [{
    key: "login",
    value: function login() {
      this.auth0.authorize();
    }
  }, {
    key: "handleAuthentication",
    value: function handleAuthentication() {
      var _this = this;

      this.auth0.parseHash(function (err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          _this.setSession(authResult); //router.replace('home')

        } else if (err) {
          console.log(err);
          alert("Error: ".concat(err.error, ". Check the console for further details."));
        }
      });
    }
  }, {
    key: "setSession",
    value: function setSession(authResult) {
      // Set the time that the access token will expire at
      var expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt); //this.authNotifier.emit('authChange', { authenticated: true })
    }
  }, {
    key: "logout",
    value: function logout() {
      // Clear access token and ID token from local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      this.userProfile = null; //this.authNotifier.emit('authChange', false)
    }
  }, {
    key: "isAuthenticated",
    value: function isAuthenticated() {
      // Check whether the current time is past the
      // access token's expiry time
      var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }
  }]);

  return AuthService;
}();

exports.default = AuthService;
//# sourceMappingURL=AuthService.js.map