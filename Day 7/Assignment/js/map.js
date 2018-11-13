

mapboxgl.accessToken = 'pk.eyJ1IjoibXJsb3N0Y2hhciIsImEiOiJjam11bDZ5bXAxbDJnM3BsOHU3bzVqYnB0In0.wKmk4XFOrj1NIPocvdl7Zw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [18.6241, -33.9249],
    zoom: 9
});

const app = new Vue({
    el: "#app",
    data: {
        start: "",
        hasStartItems: false,
        startItems: [],
        startCoor: [],

        destination: "",
        hasDestiItems: false,
        destiItems: [],
        destiCoor: []
    },
    methods: {
        route: function(){
            console.log(this.startCoor);
            console.log(this.destiCoor);
        },
        getGeoEndpoint: async function(string, isStart = false){
            await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + string + '.json', {
                params: {
                    access_token: mapboxgl.accessToken,
                    routing: true,
                    types: 'address'
                }})
                .then(success => {
                    if(isStart){
                        this.startItems = success.data.features;
                        this.hasStartItems = true;
                    } else {
                        this.destiItems = success.data.features;
                        this.hasDestiItems = true;
                    }
                })
                .catch(error => {
                    console.log(error.data.message);
                });
        },
        getStart: _.debounce(function() {
            this.getGeoEndpoint(this.start, true)
        }, 1500),
        getDest: _.debounce(function() {
            this.getGeoEndpoint(this.destination, false)
        }, 1500),
        setPoint: function(item, isStart = false){
            if(isStart){
                this.hasStartItems = false;
                this.startItems = [];

                this.start = item.place_name;
                this.startCoor = item.center;

                setMapboxMarker(this.startCoor);
            } else {
                this.hasDestiItems = false;
                this.destiItems = [];

                this.destination = item.place_name;
                this.destiCoor = item.center;

                setMapboxMarker(this.destiCoor)
            }
        },

    }
});

function setMapboxMarker(coords){
    new mapboxgl.Marker({draggable: false})
        .setLngLat([coords[0] , coords[1]])
        .addTo(map);
}