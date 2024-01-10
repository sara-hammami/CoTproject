

function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('menu-hidden');
}
var accesstoken = localStorage.getItem("accesstoken");
var mail = localStorage.getItem("mail");
var Authorizationheader = "Bearer " + accesstoken;

const apiUrl = 'https://smarwastemanagement.ltn:8443/api/sensor';
const cans = [
    { id: 0, percentage: null },
    { id: 1, percentage: null },
];
const nominatimBaseUrl = 'https://nominatim.openstreetmap.org/reverse';

// Establish WebSocket connection
const socket = new WebSocket('wss://smarwastemanagement.ltn:8443/pushes');

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
        await renderMainContent();
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
        const canId = data.id;
        const can = cans.find((can) => can.id === canId);

        if (can) {
            const distance = data.value;
            const percentage = 100.0 - (distance / 25.0) * 100;
            can.percentage = parseFloat(percentage.toFixed(2));

            // Fetch address and update UI
            const address = await getAddress(can.id);
            renderMainContent();
            console.log('Address:', address);
            // Save the data to local storage
            saveDataToLocalStorage(data);

            // Update the UI for the specific can element
            const canElement = document.querySelector(`.can[data-id="${can.id}"]`);
            if (canElement) {
                const percentageText = canElement.querySelector('.percentage-text');
                percentageText.textContent = `${can.percentage}%`;
            }
        }
    } catch (error) {
        console.error('Error parsing WebSocket data:', error);
    }
});
// Function to save data to local storage
function saveDataToLocalStorage(data) {
    const storedSensorData = JSON.parse(localStorage.getItem('sensorData')) || [];
    storedSensorData.push(data);
    localStorage.setItem('sensorData', JSON.stringify(storedSensorData));
    updateNotificationBadge();
}
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
        welcomeMessage.textContent = `Welcome, ${userData.name}`;

        mainContent.appendChild(welcomeMessage);

        // Fetch addresses and update UI for each can
        for (const can of cans) {
            const address = await getAddress(can.id);
            can.address = address;
        }

        // Render cans after fetching addresses
        const canElements = await Promise.all(cans.map(async (can) => {
            try {
                const canElement = await renderCan(can);
                console.log('Can Element:', canElement);

                if (canElement instanceof HTMLElement) {
                    return canElement;
                } else {
                    console.error('Invalid can element:', canElement);
                    return null;
                }
            } catch (renderCanError) {
                console.error('Error rendering can:', renderCanError);
                return null;
            }
        }));

        canElements
            .filter((element) => element !== null)
            .forEach((canElement) => canContainer.appendChild(canElement));

        mainContent.appendChild(canContainer);
        appContainer.appendChild(mainContent);
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

        // Redirect to map.html with coordinates and address as URL parameters
        const mapUrl = `map.html?lat=${destinationLat}&long=${destinationLon}&address=${encodeURIComponent(binAddress)}`;
        window.location.href = mapUrl;
    } catch (error) {
        console.error('Error showing location page:', error);
    }
}
