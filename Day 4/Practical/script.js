const app = new Vue({
    el: "#app",
    data: {
        timer: 60,
        errors: [],
        userGuess: 0,
        computer: generate(10),
        disabled: false,
        error_message: "",
        modalOpen: false
    },
    methods: {
        enter() {
            if(parseInt(this.userGuess) === this.computer){
               this.error_message = ('You got the guess correct')
                this.openModal();
            } else {
                this.errors.push(true);
            }

            if(this.errors.length >= 3){
                this.disabled = true;
                this.error_message = ("You failed the game");
                this.openModal()
            }
        },
        closeModal() {
            this.modalOpen = false;
            restart();
        },
        openModal(){
            this.modalOpen = true;
        }
    },
    computed: {

    }
});

var runner;

function generate(x) {
    return  Math.round(Math.random() * x)
}

function countDown() {
    app.$data.timer--;
    if(app.$data.timer === 0){
        restart()
    }
}

function stop(){
    clearInterval(runner);
}

function restart(){
    stop();
    app.$data.timer = 60;
    app.$data.errors = [];
    app.$data.computer = generate(10);
    app.$data.disabled = false;
    app.$data.error_message = "";

    start();
}

function start(){
    runner = setInterval(countDown, 1000)
}

start();