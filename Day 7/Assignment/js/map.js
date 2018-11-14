

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
        destiCoor: [],

        routeData: []
    },
    methods: {
        route: function(){
            if(this.startCoor.length > 0 && this.destiCoor.length > 0){
                this.getRoute();
            } else {
                // Give the user an error message here
            }
        },
        getRoute: async function(){
            await axios.get("https://api.mapbox.com/directions/v5/mapbox/driving/"
                + this.startCoor[0] + "," + this.startCoor[1] + ";"
                + this.destiCoor[0] + "," + this.destiCoor[1],{
                params: {
                    geometries: "geojson",
                    access_token: mapboxgl.accessToken
                }
            })
                .then(success => {
                    //success.data.routes[0].geometry
                    //.routes[0]
                    this.routeData = success.data.routes[0].geometry;

                    setMapboxLine(this.routeData);
                })
                .catch(error => {
                    console.log(error.message);
                });
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
        }, 500),
        getDest: _.debounce(function() {
            this.getGeoEndpoint(this.destination, false)
        }, 500),
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

    map.flyTo({
        center: [
            coords[0] ,
            coords[1]
        ],
        zoom: 14,
        speed: 0.7,
        curve: 1
    });
}

function setMapboxLine(coords){
    map.addLayer({
        id: 'route',
        type: 'line',
        source: {
            type: 'geojson',
            data: {
                type: "Feature",
                geometry: coords
            }
        },
        paint: {
            'line-width': 2
        }
    });

    var coordinates = coords.coordinates;
    var length = coordinates.length;
    var lng = 0;
    var lat = 0;
    var num = 0;

    if(length % 2 === 0){
        num = length/2;

        lng = coordinates[num][0];
        lat = coordinates[num][1];
    } else {
        num = (length+1)/2;

        lng = coordinates[num][0];
        lat = coordinates[num][1];
    }

    map.flyTo({
        center: [
            lng ,
            lat
        ],
        zoom: 11,
        speed: 0.7,
        curve: 1
    });
}