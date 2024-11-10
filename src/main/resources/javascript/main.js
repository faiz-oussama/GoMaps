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


function placeMarkers(locations, center, radius = 500, markerRadius = 50) {
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


function fetchAndPlaceMarkers() {
    const placeType = document.getElementById("typesComboBox").value;
    const lat = 35.170055; 
    const lon = -3.863304;
    const radius = 1000;

    const apiKey = 'AlzaSyTrEtMWhlJ2J70NOcEa9oBgOodLFfJj-dW';
    const url = `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&name=${placeType}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                const locations = data.results.map(item => ({
                    latitude: item.geometry.location.lat,
                    longitude: item.geometry.location.lng,
                    displayName: item.name,
                    address: item.vicinity
                }));
                placeMarkers(locations, { latitude: lat, longitude: lon });
            } else {
                console.error('No results found');
            }
        })
        .catch(err => console.error("Error fetching place data:", err));
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
    const geocodeUrl = "https://nominatim.openstreetmap.org/reverse?format=json&lat=35.172506&lon=-3.862348&addressdetails=1";  // Example coordinates

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

function placeMarkers(locations, center, radius = 500, markerRadius = 50) {
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
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                map.setView([lat, lon], 15);
                L.marker([lat, lon]).addTo(map).bindPopup(data[0].display_name).openPopup();
            } else {
                alert("Location not found!");
            }
        })
        .catch(err => console.error("Error fetching location:", err));
}