var accesstoken = localStorage.getItem("accesstoken");
var mail = localStorage.getItem("mail");
var Authorizationheader = "Bearer " + accesstoken;

const apiUrl = 'https://smarwastemanagement.ltn:8443/api/sensor';
const cans = [
    { id: 0, percentage: 40 },
    { id: 1, percentage: 70 },
];
const positionstackApiKey = 'be161333e03f5d3e663f3c6cbf2754ce'; // Replace with your Positionstack API key

// Establish WebSocket connection
const socket = new WebSocket('wss://mqtt.smartgarbagecot.me/pushes');

// Initialize user object
let user = { name: '' };

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch user data
        const userData = await getUser();
        user = userData;

        // Fetch initial coordinates for each can
        for (const can of cans) {
            const coordinates = await getLongLat(can.id);
            can.coordinates = coordinates;
        }

        // Render main content
        renderMainContent();
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});

socket.addEventListener('open', (event) => {
    console.log('WebSocket connection opened:', event);
});

socket.addEventListener('message', async (event) => {
    try {
        const data = JSON.parse(event.data);
        console.log('WebSocket data received:', data);

        // Update the percentage of the corresponding can based on the WebSocket data
        const canId = data.id; // Assuming the WebSocket data includes the can ID
        const can = cans.find((can) => can.id === canId);

        if (can) {
            const distance = data.value;
            const percentage = 100.0 - (distance / 25.0) * 100;
            can.percentage = parseFloat(percentage.toFixed(2));

            // Fetch address and update UI
            const address = await getAddress(can.id);
            renderMainContent();
            console.log('Address:', address);
        }
    } catch (error) {
        console.error('Error parsing WebSocket data:', error);
    }
});

async function renderMainContent() {
    const appContainer = document.getElementById('main-container');

    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    const canContainer = document.createElement('div');
    canContainer.classList.add('can-container');

    // Update welcome message to use the actual username
    const welcomeMessage = document.createElement('div');
    welcomeMessage.classList.add('welcome-text');
    welcomeMessage.textContent = `Welcome, ${user.name}`;

    mainContent.appendChild(welcomeMessage);

    // Fetch addresses and update UI
    for (const can of cans) {
        const address = await getAddress(can.id);
        can.address = address;
    }

    cans.forEach((can) => {
        const canElement = renderCan(can);
        canContainer.appendChild(canElement);
    });

    mainContent.appendChild(canContainer);
    appContainer.appendChild(mainContent);
}

function renderCan(can) {
    const canContainer = document.createElement('div');
    canContainer.classList.add('can');

    // Add click event listener to navigate to the location page and show the map
    canContainer.addEventListener('click', async () => {
        const locationText = canContainer.querySelector('.location-text');
        const addressText = canContainer.querySelector('.address-text');
        await showLocationPage(can.id, locationText, addressText);
    });

    const canImage = document.createElement('img');
    canImage.src = can.percentage < 30 ? '/assets/vide.png' : can.percentage < 70 ? './assets/moy.png' : './assets/plein.png';
    canImage.alt = 'Can Image';

    const canInfo = document.createElement('div');
    canInfo.classList.add('can-info');

    const locationImage = document.createElement('img');
    locationImage.src = './assets/location.png';
    locationImage.alt = 'Location Image';

    const locationText = document.createElement('p');
    locationText.classList.add('location-text');
    locationText.textContent = can.coordinates ? `Latitude: ${can.coordinates[0]?.toFixed(6) || 'N/A'}, Longitude: ${can.coordinates[1]?.toFixed(6) || 'N/A'}` : 'Loading...';


    const addressText = document.createElement('p');
    addressText.classList.add('address-text'); // Add a class to identify this element
    addressText.textContent = ''; // Initially empty, to be filled later

    const percentageImage = document.createElement('img');
    percentageImage.src = './assets/pourcentage.png';
    percentageImage.alt = 'Percentage Image';

    const percentageText = document.createElement('p');
    percentageText.textContent = `${can.percentage}%`;

    canInfo.appendChild(locationImage);
    canInfo.appendChild(locationText);
    canInfo.appendChild(addressText);
    canInfo.appendChild(percentageImage);
    canInfo.appendChild(percentageText);

    canContainer.appendChild(canImage);
    canContainer.appendChild(canInfo);

    return canContainer;
    console.log('Can coordinates:', can.coordinates);
    console.log('Can address:', can.address);
}

function getUser() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://smarwastemanagement.ltn:8443/api/profile/${mail}`,
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
        console.log('Backend Response Data:', responseData); // Add this line for debugging

        return responseData;
    } catch (error) {
        console.error('Error in getRequest:', error);
        throw error;
    }
}

async function getLocations(id) {
    try {
        const responseData = await getRequest();
        console.log('Response Data:', responseData);

        const location = responseData.find((singleLoc) => singleLoc.id === id);

        if (!location || !location.latitude || !location.longitude) {
            throw new Error('Invalid location data');
        }

        return location;
    } catch (error) {
        console.error('Error in getLocations:', error);
        throw error;
    }
    console.log('Location Data:', location);

}
async function getLongLat(id) {
    try {
        const location = await getLocations(id);

        // Log the value of location for debugging
        console.log('Location:', location);

        const lat = location.latitude;
        const long = location.longitude;

        return [lat, long];
    } catch (error) {
        console.error('Error in getLongLat:', error);
        throw error;
    }
}

async function getAddress(id) {
    try {
        const coord = await getLongLat(id);
        const coordinates = { latitude: coord[0], longitude: coord[1] };
        const response = await fetchAddressFromPositionStack(coordinates);
        return response;
    } catch (error) {
        console.error('Error in getAddress:', error);
        throw error;
    }
}

async function fetchAddressFromPositionStack(coordinates) {
    try {
        const { latitude, longitude } = coordinates;
        const apiUrl = 'http://api.positionstack.com/v1/reverse';
        const queryString = `?access_key=${positionstackApiKey}&query=${latitude},${longitude}`;
        const fullUrl = apiUrl + queryString;

        const response = await fetch(fullUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const address = data.data.results[0].label;

        return address;
    } catch (error) {
        console.error('Error in fetchAddressFromPositionStack:', error);
        throw error;
    }
}

async function showLocationPage(id, locationText, addressText) {
    try {
        const coordinates = await getLongLat(id);
        const address = await getAddress(id);

        // Update UI
        locationText.textContent = `Latitude: ${coordinates[0].toFixed(6)}, Longitude: ${coordinates[1].toFixed(6)}`;
        addressText.textContent = `Address: ${address}`;

        // Redirect to map.html with coordinates and address as URL parameters
        const mapUrl = `map.html?lat=${coordinates[0]}&long=${coordinates[1]}&address=${encodeURIComponent(address)}`;
        window.location.href = mapUrl;
    } catch (error) {
        console.error('Error showing location page:', error);
    }
}
