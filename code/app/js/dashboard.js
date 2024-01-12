function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('menu-hidden');
}

var accesstoken = localStorage.getItem("accesstoken");
var mail = localStorage.getItem("mail");
var Authorizationheader = "Bearer " + accesstoken;
const storedSensorData = JSON.parse(localStorage.getItem('data')) || [];

const apiUrl = 'https://smarwastemanagement.me/api/sensor';
const cans = [
    { "id": "0", percentage: null },
    { "id": "1", percentage: null },
];
const nominatimBaseUrl = 'https://nominatim.openstreetmap.org/reverse';

// Establish WebSocket connection

// Initialize user object
let user = { name: '' };
let canContainer;

const socketUrl = 'wss://smartwastemanagement.me/pushes';
let socket;
// Function to update the UI for a specific can
function updateCanUI(canId, newPercentage) {
    const canElement = document.querySelector(`#can-${canId}`);
    if (canElement) {
        const percentageText = canElement.querySelector('.percentage-text');
        percentageText.textContent = `${newPercentage}%`;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await renderMainContent();

});
function setupWebSocket(){

    socket = new WebSocket(socketUrl);
    console.log("websocket", socket);
    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection opened:', event);
    });


    socket.addEventListener('message', async (event) => {
        var appContainer = document.getElementById('main-container');
        try {
            const data = JSON.parse(event.data);
            console.log('WebSocket data received:', data);

            // Save the data to local storage
            storedSensorData.push(data);
            localStorage.setItem('data', JSON.stringify(storedSensorData));

            // Update the percentage of the corresponding can based on the WebSocket data
            const canId = data.id.toString();  // Convert to string
            console.log('canId:', canId);
            const can = cans.find((can) => can.id === canId);
            console.log('can:', can);
            if (can) {
                console.log('Found can:', can);

                const distance = parseFloat(data.value);
                const percentage = 100.0 - (distance / 25.0) * 100;
                can.percentage = parseFloat(percentage.toFixed(2));
                console.log('New percentage:', can.percentage);
                const canElement = document.querySelector(`#can-${canId}`);
                if (canElement) {
                    await updateCanUI(can, canElement);
                }
                // Fetch address and update UI
                //const address = await getAddress(can.id);
                //console.log('Address:', address);

                // Update the UI immediately for the specific can

            }
        } catch (error) {
            console.error('Error parsing WebSocket data:', error);
        }
        const preservedContent1 = appContainer.querySelector('.menu').outerHTML;
        const preservedContent2 = appContainer.querySelector('.hamburger').outerHTML;
        // Clear existing content
        appContainer.innerHTML = '';

        // Reappend preserved content
        appContainer.innerHTML = preservedContent1 + preservedContent2;
        await renderMainContent();
    });
    socket.addEventListener('error', (error) => {
        // Handle WebSocket errors
        console.error('WebSocket error:', error);
    });

    socket.addEventListener('close', (event) => {
        // Handle WebSocket closure
        console.log('WebSocket closed:', event);

        // Attempt to reconnect after a delay (e.g., 5 seconds)
        setTimeout(setupWebSocket, 5000);
    });


}

setupWebSocket()


async function renderMainContent() {
    try {
        const appContainer = document.getElementById('main-container');

        const mainContent = document.createElement('div');
        mainContent.classList.add('main-content');

        const canContainer = document.createElement('div');
        canContainer.classList.add('can-container');

        // Update welcome message to use the actual username
        const welcomeMessage = document.createElement('div');
        welcomeMessage.classList.add('welcome-text');

        // Fetch user data and set the welcome message
        const userData = await getUser();
        welcomeMessage.textContent = `Welcome, ${userData.name}`

        mainContent.appendChild(welcomeMessage);
        mainContent.appendChild(canContainer);
        appContainer.appendChild(mainContent);

        // Fetch addresses and update UI for each can
        for (const can of cans) {
            const canElement = await renderCan(can);
            if (canElement) {
                canContainer.appendChild(canElement);
            }
        }
    } catch (error) {
        console.error('Error rendering main content:', error);
    }
}

async function renderCan(can) {
    try {
        const canContainer = document.createElement('div');
        canContainer.classList.add('can');

        // Add click event listener to navigate to the location page and show the map
        canContainer.addEventListener('click', async () => {
            try {
                const coordinates = await getLongLat(can.id); // Fetch coordinates
                const addressText = canContainer.querySelector('.address-text');

                // Pass coordinates and address to showLocationPage
                await showLocationPage(coordinates, addressText.textContent, can.address);
            } catch (error) {
                console.error('Error in renderCan click event:', error);
            }
        });

        const canImage = document.createElement('img');
        canImage.src = can.percentage < 30 ? '/assets/vide.png' : can.percentage < 70 ? './assets/moy.png' : './assets/plein.png';
        canImage.alt = 'Can Image';

        const canInfo = document.createElement('div');
        canInfo.classList.add('can-info');

        const locationImage = document.createElement('img');
        locationImage.src = './assets/location.png';
        locationImage.alt = 'Location Image';

        const addressText = document.createElement('p');
        addressText.classList.add('address-text'); // Add a class to identify this element
        addressText.textContent = 'Loading...'; // Initially empty, to be filled later

        const percentageImage = document.createElement('img');
        percentageImage.src = './assets/pourcentage.png';
        percentageImage.alt = 'Percentage Image';

        const percentageText = document.createElement('p');
        percentageText.classList.add('percentage-text');
        percentageText.textContent = can.percentage !== null ? `${can.percentage}%` : 'Loading...';

        canInfo.appendChild(locationImage);
        canInfo.appendChild(addressText);
        canInfo.appendChild(percentageImage);
        canInfo.appendChild(percentageText);

        canContainer.appendChild(canImage);
        canContainer.appendChild(canInfo);

        // Fetch address and update UI
        const address = await getAddress(can.id);
        can.address = address;

        // Fetch coordinates and update UI
        const coordinates = await getLongLat(can.id);
        can.coordinates = coordinates;

        // Update UI with fetched data
        addressText.textContent = address;

        return canContainer;
    } catch (error) {
        console.error('Error rendering can:', error);
        throw error;
    }
}

function getUser() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://smarwastemanagement.me/api/profile/${mail}`,
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': Authorizationheader
            },
            success: function (data) {
                const user = {
                    name: data.fullname,
                    email: data.email,
                    // Add other user properties as needed
                };
                resolve(user);
            },
            error: function (xhr, status, error) {
                reject(new Error(`HTTP error! Status: ${status}, Error: ${error}`));
            }
        });
    });
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

async function getLocations(id) {
    try {
        const responseData = await getRequest();

        const singleLoc = responseData[id];
        const location = {
            id: singleLoc.id,
            latitude: singleLoc.latitude,
            longitude: singleLoc.longitude
        };
        return location;
    } catch (error) {
        console.error('Error in getLocations:', error);
        throw error;
    }
}

async function getLongLat(id) {
    try {
        const loc = await getLocations(id);
        const lat = loc.latitude;
        const long = loc.longitude;
        const coordinates = [lat, long];
        return coordinates;
    } catch (error) {
        console.error('Error in getLongLat:', error);
        throw error;
    }
}

async function getAddress(id) {
    try {
        const coord = await getLongLat(id);
        const coordinates = { latitude: coord[0], longitude: coord[1] };
        const response = await fetchAddressFromGeocoder(coordinates);
        return response;
    } catch (error) {
        console.error('Error in getAddress:', error);
        throw error;
    }
}

async function fetchAddressFromGeocoder(coordinates) {
    try {
        const queryString = `?format=json&lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
        const fullUrl = nominatimBaseUrl + queryString;

        const response = await fetch(fullUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const address = data.display_name;

        if (!address) {
            throw new Error('Address not found');
        }

        return address;
    } catch (error) {
        console.error('Error in fetchAddressFromGeocoder:', error);
        throw error;
    }
}

async function showLocationPage(coordinates, addressText, binAddress) {
    try {
        // Store the selected bin's coordinates globally
        destinationLat = coordinates[0];
        destinationLon = coordinates[1];

        // Update UI
        addressText.textContent = `Address: ${binAddress}`;

        // Include the map.js script dynamically
        const mapScript = document.createElement('script');
        mapScript.src = 'map.js';
        mapScript.async = true;
        document.head.appendChild(mapScript);

        // Wait for the script to be loaded, and then call getDirectionsToDestination
        mapScript.onload = function () {
            getDirectionsToDestination(userCoordinates[0], userCoordinates[1], destinationLat, destinationLon);
        };

        // Redirect to map.html with coordinates and address as URL parameters
        const mapUrl = `map.html?lat=${destinationLat}&long=${destinationLon}&address=${encodeURIComponent(binAddress)}`;
        window.location.href = mapUrl;
    } catch (error) {
        console.error('Error showing location page:', error);
    }
}