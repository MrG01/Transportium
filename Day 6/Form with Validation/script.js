const app = new Vue({
    el: "#app",
    data: {
        username: "",
        password: "",
        usernameError: false,
        usernameErrorMessage: "",
        passwordError: false,
        passwordErrorMessage: ""
    },
    methods: {
        formSubmit: function(event){
            event.preventDefault();

            this.usernameError = false;
            this.usernameErrorMessage = "";
            this.passwordError = false;
            this.passwordErrorMessage = "";

            if(this.password.length < 6){
                console.log("Password fails");
                this.passwordError = true;
                this.passwordErrorMessage = "Password is invalid"
            }

            if(this.username.length < 3){
                console.log("Username is short");
                this.usernameError = true;
                this.usernameErrorMessage = "Username is too short";
            }

            if(!this.username.includes('@')){
               console.log("Does not contain @");
                this.usernameError = true;
                this.usernameErrorMessage = "Username is invalid";
            }

            if(!this.username.indexOf('@') < 0){
                console.log("@ not found");
                this.usernameError = true;
                this.usernameErrorMessage = "Username is invalid";
            }
        },
        clearUsername: function(){
            this.usernameError = false;
        },
        clearPassword: function(){
            this.passwordError = false;
        }
    }
});