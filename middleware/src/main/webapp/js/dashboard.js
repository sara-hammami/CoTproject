// dashboard.js

const cans = [
    { id: 0, percentage: 40, location: "(36.89193949759226, 10.187806081767315)" },
    { id: 1, percentage: 70, location: 'Location 2' },
];

function renderMainContent() {
    const appContainer = document.getElementById('main-container');

    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    const canContainer = document.createElement('div');
    canContainer.classList.add('can-container');

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

    const canImage = document.createElement('img');
    canImage.src = can.percentage < 30 ? '/assets/vide.png' : can.percentage < 70 ? './assets/moy.png' : './assets/plein.png';
    canImage.alt = 'Can Image';

    const canInfo = document.createElement('div');
    canInfo.classList.add('can-info');

    const locationImage = document.createElement('img');
    locationImage.src = './assets/location.png';
    locationImage.alt = 'Location Image';

    const locationText = document.createElement('p');
    locationText.textContent = can.location.includes('(') ? parseCoordinates(can.location) : can.location;

    const percentageImage = document.createElement('img');
    percentageImage.src = './assets/pourcentage.png';
    percentageImage.alt = 'Percentage Image';

    const percentageText = document.createElement('p');
    percentageText.textContent = `${can.percentage}%`;

    canInfo.appendChild(locationImage);
    canInfo.appendChild(locationText);
    canInfo.appendChild(percentageImage);
    canInfo.appendChild(percentageText);

    // Add click event listener to navigate to the location page and show the map
    canContainer.addEventListener('click', showLocationPage);

    canContainer.appendChild(canImage);
    canContainer.appendChild(canInfo);

    return canContainer;
}

function parseCoordinates(coordString) {
    const regex = /\((.*),(.*)\)/;
    const match = regex.exec(coordString);

    if (match && match.length === 3) {
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[2]);
        return `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;
    } else {
        return coordString;
    }
}

function showLocationPage() {
    // Define the functionality for showing the location page here
    console.log('Showing location page...');
    // For now, you can leave it empty or add placeholder code.
}

// Call renderMainContent when the DOM is loaded
document.addEventListener('DOMContentLoaded', renderMainContent);
