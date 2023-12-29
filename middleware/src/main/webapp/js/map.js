document.addEventListener('DOMContentLoaded', function () {
    const appContainer = document.getElementById('app');
    let map;
    let mapController;
    const markers = [];
    const polylines = [];
    let getdistance = false;
    let distance = 0.0;

    async function initMap() {
        map = L.map('app').setView([36.80278, 10.17972], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        mapController = map;
    }

    async function getCurrentLocation() {
        const position = await getUserCurrentLocation();
        const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
        const cameraPosition = {
            center: pos,
            zoom: 14,
        };
        if (!getdistance) {
            mapController.panTo(pos);
        }
        addMarker(pos);
        if (getdistance) {
            mapController.flyTo(pos);
            const startpos = pos;
            getDirections(startpos, pos);
        }
    }

    async function getLocation(pos) {
        const location = L.latLng(pos.lat, pos.lng);
        const cameraPosition = {
            center: location,
            zoom: 14,
        };
        if (!getdistance) {
            mapController.panTo(location);
        }
        addMarker(location);
        if (getdistance) {
            mapController.flyTo(location);
            const startpos = await getUserCurrentLocation();
            getDirections(startpos, location);
        }
    }

    function addMarker(pos) {
        const marker = L.marker([pos.lat, pos.lng]).addTo(mapController);
        markers.push(marker);
    }

    async function getDirections(startPos, endPos) {
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(startPos.lat, startPos.lng),
                L.latLng(endPos.lat, endPos.lng)
            ],
            routeWhileDragging: true
        });

        routingControl.on('routesfound', function (e) {
            const routes = e.routes;
            let totalDistance = 0;

            routes.forEach(function (route) {
                totalDistance += route.summary.totalDistance;
            });

            // Convert distance to kilometers
            totalDistance /= 1000;

            distance = totalDistance;
            updateDistanceUI();

            // add to the list of polyline coordinates
            addPolyLine(route.coordinates);
        });

        routingControl.addTo(mapController);
    }

    function updateDistanceUI() {
        const distanceContainer = document.getElementById('distance-container');
        distanceContainer.innerHTML = `Total Distance: ${distance.toFixed(2)} KM`;
    }

    async function getUserCurrentLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    function addPolyLine(coordinates) {
        const polyline = L.polyline(coordinates, { color: 'red' }).addTo(mapController);
        polylines.push(polyline);
    }

    document.getElementById('get-current-location-btn').addEventListener('click', getCurrentLocation);

    initMap();
    getCurrentLocation();
});
