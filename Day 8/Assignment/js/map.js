"use strict";

mapboxgl.accessToken = 'pk.eyJ1IjoibXJsb3N0Y2hhciIsImEiOiJjam11bDZ5bXAxbDJnM3BsOHU3bzVqYnB0In0.wKmk4XFOrj1NIPocvdl7Zw';
const mapVar = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [18.6241, -33.9249],
    zoom: 9
});

const vueApp = new Vue({
    el: "#app",
    data: {
        CLIENT_ID: "3efde9ea-fcaf-44b6-8180-76e8933c61da",
        CLIENT_SECRET: "oWXmg3eFFPFl97mcYMZ3KBXMc22MmtTnJ+XeweV/G3g=",
        myTransAccPoint: "",

        start: "",
        hasStartItems: false,
        startItems: [],
        startCoor: [],

        destination: "",
        hasDestiItems: false,
        destiItems: [],
        destiCoor: [],

        directionData: [],

        hasJourneyItems: true,
        journeyItems: []
    },
    async created() {
        if (this.hasValidToken()) {
            this.myTransAccPoint = this.getTokenFomCache();
        } else {
            this.getTokenFromApi();
        }

        this.journeyItems.push({
            name: "test"
        })
        this.journeyItems.push({
            name: "test"
        })
        this.journeyItems.push({
            name: "test"
        })
        this.journeyItems.push({
            name: "test"
        })
        this.journeyItems.push({
            name: "test"
        })
        this.journeyItems.push({
            name: "test"
        })

    },
    methods: {
        route: function () {
            if (this.startCoor.length > 0 && this.destiCoor.length > 0) {
                //this.getRoute();
                this.getItineraries();
            } else {
                // Give the user an error message here
            }
        },
        getRoute: async function () {
            await axios.get("https://api.mapbox.com/directions/v5/mapbox/driving/"
                + this.startCoor[0] + "," + this.startCoor[1] + ";"
                + this.destiCoor[0] + "," + this.destiCoor[1], {
                params: {
                    geometries: "geojson",
                    access_token: mapboxgl.accessToken
                }
            })
                .then(success => {
                    //success.data.routes[0].geometry
                    //.routes[0]
                    this.directionData = success.data.routes[0].geometry;

                    setMapboxLine(this.directionData);
                })
                .catch(error => {
                    console.log(error.message);
                });
        },
        getGeoEndpoint: async function (string, isStart = false) {
            await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + string + '.json', {
                params: {
                    access_token: mapboxgl.accessToken,
                    routing: true,
                    types: 'address'
                }
            })
                .then(success => {
                    if (isStart) {
                        this.startItems = success.data.features;
                        this.hasStartItems = true;
                    } else {
                        this.destiItems = success.data.features;
                        this.hasDestiItems = true;
                    }
                })
                .catch(error => {
                    console.log(error.message);
                });
        },
        getStart: _.debounce(function () {
            this.getGeoEndpoint(this.start, true)
        }, 500),
        getDest: _.debounce(function () {
            this.getGeoEndpoint(this.destination, false)
        }, 500),
        setPoint: function (item, isStart = false) {
            if (isStart) {
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

        hasValidToken: function () {
            var token = localStorage.getItem('myTransportToken');
            var storageDate = localStorage.getItem('myTransportTokenStoreDate');

            if (token) {
                var convertedDate = parseInt(storageDate.replace(/,/gi, ''));
                var dateNow = Date.now();

                return convertedDate + 3600 * 1000 >= dateNow;
            }

            return false;
        },
        getTokenFomCache: function () {
            var token = localStorage.getItem('myTransportToken');

            if (token === null || token === undefined || token === 'undefined') {
                this.getTokenFromApi()
            }

            return token
        },
        setToken: function (token) {
            localStorage.setItem('myTransportToken', token);
            localStorage.setItem('myTransportTokenStoreDate', Date.now().toString())
        },
        getTokenFromApi: async function () {
            var form = new FormData();
            form.append("client_id", this.CLIENT_ID);
            form.append("client_secret", this.CLIENT_SECRET);
            form.append("grant_type", "client_credentials");
            form.append("scope", "transportapi:all");

            await axios.post('https://identity.whereismytransport.com/connect/token',
                form, {
                headers: {
                    responseType: 'json'
                }})
                .then(response => {
                    var token = response.data.access_token;

                    this.setToken(token);
                    this.myTransAccPoint = token;
                })
                .catch(error => {
                    console.log(error.message);
                })
        },

        getItineraries: async function () {

        },
        selectIten: function (iten) {

        }


        /*headers: { Authorization: "Bearer " + token } */
    }
});

function setMapboxMarker(coords) {
    new mapboxgl.Marker({draggable: false})
        .setLngLat([coords[0], coords[1]])
        .addTo(mapVar);

    mapVar.flyTo({
        center: [
            coords[0],
            coords[1]
        ],
        zoom: 14,
        speed: 0.7,
        curve: 1
    });
}

function setMapboxLine(coords) {
    mapVar.addLayer({
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

    if (length % 2 === 0) {
        num = length / 2;

        lng = coordinates[num][0];
        lat = coordinates[num][1];
    } else {
        num = (length + 1) / 2;

        lng = coordinates[num][0];
        lat = coordinates[num][1];
    }

    mapVar.flyTo({
        center: [
            lng,
            lat
        ],
        zoom: 11,
        speed: 0.7,
        curve: 1
    });
}