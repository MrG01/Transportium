const app = new Vue({
    el: "#app",
    data: {
        username: "",
        password: "",
        usernameError: false,
        usernameErrorMessage: [],
        passwordError: false,
        passwordErrorMessage: []
    },
    methods: {
        formSubmit: function(event){
            event.preventDefault();

            this.usernameError = false;
            this.usernameErrorMessage = [];
            this.passwordError = false;
            this.passwordErrorMessage = [];

            if(this.password.length < 6){
                console.log("Password fails");
                this.passwordError = true;
                this.passwordErrorMessage.push({msg: "Password is invalid", date: Date.now()});
            }

            if(this.username.length < 3){
                console.log("Username is short");
                this.usernameError = true;
                this.usernameErrorMessage.push({msg: "Username is too short", date: Date.now()});
            }

            if(!this.username.includes('@')){
               console.log("Does not contain @");
                this.usernameError = true;
                this.usernameErrorMessage.push({msg: "Username does not contain '@'", date: Date.now()});
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