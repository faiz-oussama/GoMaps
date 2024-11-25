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
let selectedMarker = null;

let currentLat = 35.172506;
let currentLon = -3.862348;



map.on('click', function(e) {
    currentLat = e.latlng.lat;
    currentLon = e.latlng.lng;

    if (selectedMarker) {
        map.removeLayer(selectedMarker);
    }
    selectedMarker = L.marker([currentLat, currentLon]).addTo(map);

});



function clearMarkers() {
    if(searchMarker) searchMarker.remove();
    if (circle) circle.remove();
    if (markers) markers.forEach(marker => marker.remove());
    if (locationCircles) locationCircles.forEach(circle => circle.remove());
}

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

function searchLocation(query) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                currentLat = parseFloat(data[0].lat);
                currentLon = parseFloat(data[0].lon);
                map.flyTo([currentLat, currentLon], 20);
                addSearchMarker(currentLat, currentLon, data[0].display_name);
            } else {
                alert("Location not found!");
            }
        })
        .catch(err => alert("Error fetching location: " + err));
}

function setMyLocation() {
    const geocodeUrl = "https://nominatim.openstreetmap.org/reverse?format=json&lat=35.172506&lon=-3.862348&addressdetails=1";

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.lat && data.lon) {
                currentLat = parseFloat(data.lat);
                currentLon = parseFloat(data.lon);
                addFixedLocationCircle(currentLat, currentLon);
                map.flyTo([currentLat, currentLon], 16.5);
                addSearchMarker(currentLat, currentLon, data.display_name);
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

function clearSearch() {
    clearMarkers();
    const tableBody = document.querySelector('#searchResultsTable tbody');
    tableBody.innerHTML = '';
}

function fetchAndPlaceMarkers() {
    const lat = currentLat;
    const lon = currentLon;
    const radius = parseInt(radiusSlider.value); 

    const apiKey = 'AlzaSyTrEtMWhlJ2J70NOcEa9oBgOodLFfJj-dW';  
    const url = `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&name=${selectedPlaceType}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#searchResultsTable tbody');
            tableBody.innerHTML = ''; 

            if (data.results) {
                const locations = data.results.map(item => ({
                    latitude: item.geometry.location.lat,
                    longitude: item.geometry.location.lng,
                    displayName: item.name,
                    address: item.vicinity,
                    placeId: item.place_id
                }));

                placeMarkers(locations, { latitude: lat, longitude: lon }, radius);

                locations.forEach(location => {
                    const distance = calculateDistance(lat, lon, location.latitude, location.longitude); 
                    const row = document.createElement('tr');
                    row.classList.add('styled-row'); 
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

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.floor(R * c * 1000); 
}

function displayStars(rating) {
    let stars = '';
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 0.5 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

function showLocationInfo(placeId) {
    const placeInfoPanel = document.getElementById("placeInfoPanel");
    const placeImage = document.getElementById("placeImage");
    const placeName = document.getElementById("placeName");
    const placeDetails = document.getElementById("placeDetails");
    const placeDistance = document.getElementById("placeDistance");

    const myLat = 35.172506;
    const myLon = -3.862348;

    const apiKey = 'AlzaSyTrEtMWhlJ2J70NOcEa9oBgOodLFfJj-dW';

    const placeDetailsUrl = `https://maps.gomaps.pro/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

    fetch(placeDetailsUrl)
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                const place = data.result;

                placeImage.src = place.photos ? `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}` : '';
                placeName.textContent = place.name;

                placeDetails.innerHTML = '';

                if (place.rating) {
                    const ratingDiv = document.createElement('div');
                    ratingDiv.className = 'detail';
                    ratingDiv.innerHTML = displayStars(place.rating);
                    placeDetails.appendChild(ratingDiv);
                }

                if (place.formatted_phone_number) {
                    const phoneDiv = document.createElement('div');
                    phoneDiv.className = 'detail';
                    phoneDiv.innerHTML = `<i class="fas fa-phone"></i> <span>${place.formatted_phone_number}</span>`;
                    placeDetails.appendChild(phoneDiv);
                }

                if (place.formatted_address) {
                    const addressDiv = document.createElement('div');
                    addressDiv.className = 'detail';
                    addressDiv.innerHTML = `<i class="fas fa-map-marker-alt"></i> <span>${place.formatted_address}</span>`;
                    placeDetails.appendChild(addressDiv);
                }

                placeDistance.textContent = `Distance from you: ${calculateDistance(myLat, myLon, place.geometry.location.lat, place.geometry.location.lng)} meters`;

                placeInfoPanel.style.display = "block";
                placeInfoPanel.classList.add("active");

                placeInfoPanel.setAttribute("data-lat", place.geometry.location.lat);
                placeInfoPanel.setAttribute("data-lon", place.geometry.location.lng);
            } else {
                console.error("Place details not found");
            }
        })
        .catch(err => console.error("Error fetching place data:", err));
}

function drawRouteOnMap() {
    const placeInfoPanel = document.getElementById("placeInfoPanel");
    const destinationLat = parseFloat(placeInfoPanel.getAttribute("data-lat"));
    const destinationLon = parseFloat(placeInfoPanel.getAttribute("data-lon"));

    const myLat = 35.172506;
    const myLon = -3.862348;

    const apiKey = 'AlzaSyTrEtMWhlJ2J70NOcEa9oBgOodLFfJj-dW';

    const directionsUrl = `https://maps.gomaps.pro/maps/api/directions/json?origin=${myLat},${myLon}&destination=${destinationLat},${destinationLon}&key=${apiKey}`;

    fetch(directionsUrl)
        .then(response => response.json())
        .then(directionsData => {
            if (directionsData.routes && directionsData.routes.length > 0) {
                const route = directionsData.routes[0];
                drawRoute(route);
            } else {
                console.error("No directions found");
            }
        })
        .catch(err => console.error("Error fetching directions:", err));
}

function drawRoute(route) {
    const coordinates = [];

    route.legs[0].steps.forEach(step => {
        coordinates.push([step.start_location.lat, step.start_location.lng]);
        coordinates.push([step.end_location.lat, step.end_location.lng]);
    });

    if (routePolyline) {
        map.removeLayer(routePolyline);
    }
    
    routePolyline = L.polyline(coordinates, { color: 'blue', weight: 9, opacity: 0.9 }).addTo(map);
    map.fitBounds(routePolyline.getBounds());
}

const radiusSlider = document.getElementById('radius');
const radiusValue = document.getElementById('radiusValue');

radiusSlider.addEventListener('input', function() {
    const radius = parseInt(radiusSlider.value);
    radiusValue.textContent = `${radius}m`;

    placeMarkers(locations, { latitude: 35.172506, longitude: -3.862348 }, radius);
});

const optionMenu = document.querySelector(".select-menu"),
      selectBtn = optionMenu.querySelector(".select-btn"),
      options = optionMenu.querySelectorAll(".option"),
      sBtn_text = optionMenu.querySelector(".sBtn-text");

let selectedPlaceType = "";

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

options.forEach(option => {
    option.addEventListener("click", () => {
        selectedPlaceType = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedPlaceType;
        optionMenu.classList.remove("active");
    });
});

document.getElementById("findNearbyPlacesBtn").addEventListener("click", fetchAndPlaceMarkers);
document.getElementById("closeInfoPanel").addEventListener("click", () => {
    document.getElementById("placeInfoPanel").classList.remove("active");
});
document.getElementById("getDirectionsBtn").addEventListener("click", drawRouteOnMap);