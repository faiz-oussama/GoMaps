const map = L.map('map', { zoomControl: false }).setView([33.589886, -7.603869], 13);
let osm = null;
let nearbySearchMarker = null;

let osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Zooming controls
let zoomIn = () => map.zoomIn();
let zoomOut = () => map.zoomOut();

let searchMarker = null;

// Remove marker from map
function removeLocationMarker() {
    if (searchMarker) {
        map.removeLayer(searchMarker);
        searchMarker = null;
    }
}

// Add search marker
function addSearchMarker(lat, lon, displayName) {
    if (searchMarker) {
        searchMarker.remove();
    }

    searchMarker = L.marker([lat, lon]).addTo(map);
    searchMarker.bindPopup(displayName).openPopup();
}

let circle = null;
function addFixedLocationCircle(lat, lon) {
    circle = L.circle([lat, lon], {
        radius: 14,  // Smaller radius to resemble a "dot"
        color: '#fff',
        opacity: 1,  // Blue color
        fillColor: '#007bff', // Fill color (blue)
        fillOpacity: 0.7, // Fully opaque to mimic a solid dot
        weight: 4 // Thicker border to resemble a "location dot"
    }).addTo(map);
    circle.setStyle({
        boxShadow: '0 0 10px rgba(0, 123, 255, 0.5)'  // Soft blue shadow
    });
}

function setMyLocation() {
    // Using Nominatim API to fetch location based on an address or predefined coordinates.
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

function placeMarkers(locations, center, radius, markerRadius) {
    if (circle) circle.remove();
    if (markers) markers.forEach(marker => marker.remove());
    if (locationCircles) locationCircles.forEach(circle => circle.remove());

    circle = L.circle([center.location.latitude, center.location.longitude], {
        radius: radius,
        fillColor: '#65B741',
        fillOpacity: 0.12,
        color: '#163020',
        weight: 1,
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
        return L.marker([location.location.latitude, location.location.longitude], {
            riseOnHover: true,
            bounceOnAdd: true,
            icon: greenIcon,
            title: location.displayName.text,
        }).on('click', function () {
            LeafletMapController.handleMarkerClick(JSON.stringify(location));
        }).addTo(map);
    });

    locationCircles = locations.map(location => {
        return L.circle([location.location.latitude, location.location.longitude], {
            radius: markerRadius,
            fillColor: '#0952ff',
            fillOpacity: 0.12,
            color: '#163020',
            weight: 1,
        }).addTo(map);
    });

    map.fitBounds(circle.getBounds());
}

// Remove places markers
function removePlacesMarkers() {
    if (markers) markers.forEach(marker => marker.remove());
    if (circle) circle.remove();
}

// Search for a location
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
