
function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('menu-hidden');
}

// Initialize the map
var map = L.map('map').setView([0, 0], 15);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to get the current position and display address in a popup
function getCurrentPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            // Use Nominatim for reverse geocoding
            var nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

            fetch(nominatimUrl)
                .then(response => response.json())
                .then(data => {
                    var address = data.display_name || 'Address not found';

                    // Set the map view to the current position
                    map.setView([lat, lon], 15);

                    // Add a marker with a popup displaying the address
                    L.marker([lat, lon]).addTo(map)
                        .bindPopup('Your Current Location:<br>' + address).openPopup();
                    getDirectionsToDestination(lat, lon, destinationLat, destinationLon);
                })

                .catch(error => {
                    console.error('Error during reverse geocoding:', error);
                    alert('Error during reverse geocoding');
                });
        }, function (error) {
            alert('Error getting your location: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}
let destinationLat;
let destinationLon;
async function renderBinLocations() {
    try {
        // Fetch bin locations
        const responseData = await getRequest();

        // Iterate over each bin location and add a marker to the map with a popup
        for (const bin of responseData) {
            destinationLat = bin.latitude;  // Store destination coordinates globally
            destinationLon = bin.longitude;
            const address = await getAddressFromLocation(destinationLat, destinationLon);

            // Add a marker with a popup displaying the bin's address
            L.marker([destinationLat, destinationLon]).addTo(map)
                .bindPopup(`Bin Location:<br>Latitude: ${destinationLat}, Longitude: ${destinationLon}<br>Address: ${address}`).openPopup();
        }
    } catch (error) {
        console.error('Error rendering bin locations:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await renderBinLocations(); // Wait for bin locations to be rendered
    getCurrentPosition(); // Now you can call getCurrentPosition, and it will have the necessary destination coordinates
});
async function getAddressFromLocation(lat, lon) {
    try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
        const response = await fetch(nominatimUrl);
        const data = await response.json();
        return data.display_name || 'Address not found';
    } catch (error) {
        console.error('Error during reverse geocoding:', error);
        return 'Address not found';
    }
}

async function getRequest() {
    try {
        const accessToken = localStorage.getItem("accesstoken");
        const url = "https://smarwastemanagement.ltn:8443/api/sensor";
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error in getRequest:', error);
        throw error;
    }
}




// Function to draw directions from the current position to a specific destination
function getDirectionsToDestination(startLat, startLon, destinationLat, destinationLon) {
    // Add a marker for the destination position
    var destinationMarker = L.marker([destinationLat, destinationLon]).addTo(map);

    // Create a routing control
    var control = L.Routing.control({
        waypoints: [
            L.latLng(startLat, startLon),
            L.latLng(destinationLat, destinationLon)
        ],
        routeWhileDragging: true
    }).addTo(map);

    // Event handler for removing markers when the route is cleared
    map.on('routing:clear', function () {
        map.removeLayer(destinationMarker);
    });
}
