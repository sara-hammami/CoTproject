// Function to toggle the visibility of the menu
function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('menu-hidden');
}

// Create a Leaflet map with an initial view centered at [0, 0] and zoom level 15
var map = L.map('map', {
    zoomControl: false // Disable the default zoom control
}).setView([0, 0], 15);

// Add an OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Move the Leaflet zoom control to the top-right corner of the map
L.control.zoom({ position: 'topright' }).addTo(map);

// Global variable to track the visibility of directions
var directionsVisible = true;

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
        const url = "https://smarwastemanagement.me/api/sensor";
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
    var detailsContainer = document.createElement('div');
    detailsContainer.style.position = 'absolute';
    detailsContainer.style.bottom = '10px';
    detailsContainer.style.left = '10px';
    detailsContainer.style.backgroundColor = '#fff';
    detailsContainer.style.padding = '10px';
    detailsContainer.style.border = '1px solid #ccc';
    detailsContainer.style.zIndex = '1000'; // Ensure it's on top
    detailsContainer.style.cursor = 'pointer'; // Set cursor to pointer for click interaction

// Add some initial text to the details container
    detailsContainer.innerHTML += ' Click here to toggle details';

// Event handler to toggle directions visibility when clicking on the container
    detailsContainer.addEventListener('click', function () {
        directionsVisible = !directionsVisible;
        control.setWaypoints([
            L.latLng(startLat, startLon),
            L.latLng(destinationLat, destinationLon)
        ]);
        control[directionsVisible ? 'show' : 'hide']();
    });

    map.getContainer().appendChild(detailsContainer);
}
// Container to display step-by-step details
