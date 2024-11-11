const map = L.map('map', { zoomControl: false }).setView([33.589886, -7.603869], 13);
let osm = null;
let nearbySearchMarker = null;

let osmLayer = L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=pveDabKqKvojR5EZXAR7').addTo(map);


let zoomIn = () => map.zoomIn();
let zoomOut = () => map.zoomOut();

let searchMarker = null;
let circle = null;
let locationCircles = [];
let markers = [];
let routePolyline = null;


function removeLocationMarker() {
    if (searchMarker) {
        map.removeLayer(searchMarker);
        searchMarker = null;
    }
}

function addSearchMarker(lat, lon, displayName) {
    if (searchMarker) {
        searchMarker.remove();
    }

    searchMarker = L.marker([lat, lon]).addTo(map);
    searchMarker.bindPopup(displayName).openPopup();
}

function clearMarkers() {
    if (circle) circle.remove();
    if (markers) markers.forEach(marker => marker.remove());
    if (locationCircles) locationCircles.forEach(circle => circle.remove());
}


function placeMarkers(locations, center, radius = 1000, markerRadius = 50) {
    clearMarkers();
    circle = L.circle([center.latitude, center.longitude], {
        radius: radius,
        fillColor: '#65B741',
        fillOpacity: 0.12,
        color: '#ffffff',
        weight: 2,
    }).addTo(map);

    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    markers = locations.map(location => {
        const marker = L.marker([location.latitude, location.longitude], {
            icon: greenIcon,
            title: location.displayName,
            riseOnHover: true
        })
        .bindPopup(`<b>${location.displayName}</b><br>${location.address || ''}`)
        .addTo(map);
        return marker;
    });

    locationCircles = locations.map(location => {
        return L.circle([location.latitude, location.longitude], {
            radius: markerRadius,
            fillColor: '#0952ff',
            fillOpacity: 0.25,
            color: '#ffffff',
            weight: 2,
        }).addTo(map);
    });

    map.fitBounds(circle.getBounds());
}


function addFixedLocationCircle(lat, lon) {
    circle = L.circle([lat, lon], {
        radius: 14,  
        color: '#fff',
        opacity: 1,  
        fillColor: '#007bff',
        fillOpacity: 0.7, 
        weight: 4,
    }).addTo(map);
    circle.setStyle({
        boxShadow: '0 0 10px rgba(0, 123, 255, 0.5)'
    });
}

function setMyLocation() {
    const geocodeUrl = "https://nominatim.openstreetmap.org/reverse?format=json&lat=35.172506&lon=-3.862348&addressdetails=1";

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.lat && data.lon) {
                const lat = parseFloat(data.lat);
                const lon = parseFloat(data.lon);

                addFixedLocationCircle(lat, lon);
                map.flyTo([lat, lon], 16.5);
                addSearchMarker(lat, lon, data.display_name);
            } else {
                alert("Location not found!");
            }
        })
        .catch(err => alert("Error fetching location: " + err));
}


function removePlacesMarkers() {
    if (markers) markers.forEach(marker => marker.remove());
    if (circle) circle.remove();
}

function searchLocation(query) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                map.flyTo([lat, lon], 20);
                addSearchMarker(lat, lon, data[0].display_name);
            } else {
                alert("Location not found!");
            }
        })
        .catch(err => alert("Error fetching location: " + err));
}


function clearMarkers() {
    if (circle) circle.remove();
    if (markers) markers.forEach(marker => marker.remove());
    if (locationCircles) locationCircles.forEach(circle => circle.remove());
}

function placeMarkers(locations, center, radius = 1000, markerRadius = 50) {
    clearMarkers();

    // Update the big circle with the selected radius from the slider
    circle = L.circle([center.latitude, center.longitude], {
        radius: radius,
        fillColor: '#65B741',
        fillOpacity: 0.12,
        color: '#ffffff',
        weight: 2,
    }).addTo(map);

    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    markers = locations.map(location => {
        const marker = L.marker([location.latitude, location.longitude], {
            icon: greenIcon,
            title: location.displayName,
            riseOnHover: true
        })
        .bindPopup(`<b>${location.displayName}</b><br>${location.address || ''}`)
        .addTo(map);
        return marker;
    });

    locationCircles = locations.map(location => {
        return L.circle([location.latitude, location.longitude], {
            radius: markerRadius,
            fillColor: '#0952ff',
            fillOpacity: 0.25,
            color: '#ffffff',
            weight: 2,
        }).addTo(map);
    });

    map.fitBounds(circle.getBounds()); // Adjust map view based on the circle
}
const radiusSlider = document.getElementById('radius');
const radiusValue = document.getElementById('radiusValue');

radiusSlider.addEventListener('input', function() {
    const radius = parseInt(radiusSlider.value);
    radiusValue.textContent = `${radius}m`;

    placeMarkers(locations, { latitude: 35.172506, longitude: -3.862348 }, radius);
});

function searchLocation(query) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                map.flyTo([lat, lon], 15);
                L.marker([lat, lon]).addTo(map).bindPopup(data[0].display_name).openPopup();
            } else {
                alert("Location not found!");
            }
        })
        .catch(err => console.error("Error fetching location:", err));
}

const optionMenu = document.querySelector(".select-menu"),
      selectBtn = optionMenu.querySelector(".select-btn"),
      options = optionMenu.querySelectorAll(".option"),
      sBtn_text = optionMenu.querySelector(".sBtn-text");

// Store the selected place type when an option is clicked
let selectedPlaceType = "";

// Toggle the dropdown menu when the button is clicked
selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

// Update the selected place type when an option is clicked and close the dropdown
options.forEach(option => {
    option.addEventListener("click", () => {
        // Set the selected place type based on the clicked option
        selectedPlaceType = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedPlaceType;
        optionMenu.classList.remove("active"); // Close the dropdown after selection
    });
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Return distance in meters
}

function fetchAndPlaceMarkers() {
    const lat = 35.172506;  // Your location's latitude
    const lon = -3.862348;  // Your location's longitude
    const radius = parseInt(radiusSlider.value); // Get the radius value from the slider

    const apiKey = 'AlzaSyTrEtMWhlJ2J70NOcEa9oBgOodLFfJj-dW';  // Replace with your actual API key
    const url = `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&name=${selectedPlaceType}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#searchResultsTable tbody');
            tableBody.innerHTML = ''; // Clear any previous search results

            if (data.results) {
                const locations = data.results.map(item => ({
                    latitude: item.geometry.location.lat,
                    longitude: item.geometry.location.lng,
                    displayName: item.name,
                    address: item.vicinity,
                    placeId: item.place_id  // Store the place_id for additional info
                }));

                // Add markers to the map
                placeMarkers(locations, { latitude: lat, longitude: lon }, radius);

                // Populate the table with the fetched locations
                locations.forEach(location => {
                    const distance = calculateDistance(lat, lon, location.latitude, location.longitude); // Calculate distance
                    const row = document.createElement('tr');
                    row.classList.add('styled-row'); // Add class to each row
                    row.innerHTML = `
                        <td>${location.displayName}</td>
                        <td>${Math.round(distance)} meters</td>
                        <td><button onclick="showLocationInfo('${location.placeId}')" class="styled-button">Show</button></td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error('No results found');
            }
        })
        .catch(err => console.error("Error fetching place data:", err));
}

// Attach fetch function to the button to trigger on click
document.getElementById("findNearbyPlacesBtn").addEventListener("click", fetchAndPlaceMarkers);

function showLocationInfo(placeId) {
    const placeInfoPanel = document.getElementById("placeInfoPanel");
    const placeImage = document.getElementById("placeImage");
    const placeName = document.getElementById("placeName");
    const placeDistance = document.getElementById("placeDistance");

    // Your current location (for example)
    const myLat = 35.172506;
    const myLon = -3.862348;

    const apiKey = 'AlzaSyTrEtMWhlJ2J70NOcEa9oBgOodLFfJj-dW';

    // GoMaps API URL to fetch details about the place
    const placeDetailsUrl = `https://maps.gomaps.pro/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

    // Fetch place details
    fetch(placeDetailsUrl)
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                const place = data.result;

                // Update the UI with place data
                placeImage.src = place.photos ? `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}` : '';
                placeName.textContent = place.name;
                placeDistance.textContent = `Distance from you: ${calculateDistance(myLat, myLon, place.geometry.location.lat, place.geometry.location.lng)} meters`;

                // Display the info panel
                placeInfoPanel.style.display = "block";

                // Store the place info for later use (route drawing)
                placeInfoPanel.setAttribute("data-lat", place.geometry.location.lat);
                placeInfoPanel.setAttribute("data-lon", place.geometry.location.lng);
            } else {
                console.error("Place details not found");
            }
        })
        .catch(err => console.error("Error fetching place data:", err));
}

// Close the info panel
document.getElementById("closeInfoPanel").addEventListener("click", () => {
    document.getElementById("placeInfoPanel").style.display = "none";
});

// Function to draw route on the Leaflet map
function drawRouteOnMap() {
    const placeInfoPanel = document.getElementById("placeInfoPanel");
    const destinationLat = parseFloat(placeInfoPanel.getAttribute("data-lat"));
    const destinationLon = parseFloat(placeInfoPanel.getAttribute("data-lon"));

    // Your current location (for example)
    const myLat = 35.172506;
    const myLon = -3.862348;

    const apiKey = 'AlzaSyTrEtMWhlJ2J70NOcEa9oBgOodLFfJj-dW'; // Use your actual API key

    // Directions API URL
    const directionsUrl = `https://maps.gomaps.pro/maps/api/directions/json?origin=${myLat},${myLon}&destination=${destinationLat},${destinationLon}&key=${apiKey}`;

    fetch(directionsUrl)
        .then(response => response.json())
        .then(directionsData => {
            if (directionsData.routes && directionsData.routes.length > 0) {
                const route = directionsData.routes[0];
                drawRoute(route); // Call the function to draw the route
            } else {
                console.error("No directions found");
            }
        })
        .catch(err => console.error("Error fetching directions:", err));
}

// Function to draw the route on the map
function drawRoute(route) {
    const coordinates = [];

    // Extract coordinates from the route
    route.legs[0].steps.forEach(step => {
        coordinates.push([step.start_location.lat, step.start_location.lng]);
        coordinates.push([step.end_location.lat, step.end_location.lng]);
    });

    // Remove any existing route polyline
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }

    // Create and add a new polyline to the map
    routePolyline = L.polyline(coordinates, { color: 'blue', weight: 8, opacity: 0.7 }).addTo(map);

    // Adjust the map view to fit the route
    map.fitBounds(routePolyline.getBounds());
}

// Event listener for the "Get Directions" button
document.getElementById("getDirectionsBtn").addEventListener("click", drawRouteOnMap);
