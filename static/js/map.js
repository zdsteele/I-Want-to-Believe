// Mapbox API Key (Replace with your own!)
const MAPBOX_API_KEY = "pk.eyJ1IjoiemRzdGVlbGUiLCJhIjoiY202NDNjanZzMWNmeTJ2cHk5NmhmeGJkcyJ9.LQOFJFUkr6h7Lalj95r4Rg";

// Initialize Leaflet Map
var map = L.map("map", {
    center: [39.8283, -98.5795], // Default center (U.S.)
    zoom: 5, // Default zoom level
    minZoom: 3, // Prevents zooming out too far
    maxZoom: 18, // Maximum zoom
    maxBounds: [ // Restrict panning to around the U.S.
        [10, -140], // Southwest corner (Mexico/Pacific)
        [60, -50]   // Northeast corner (Canada/Atlantic)
    ],
    maxBoundsViscosity: 1.0 // Makes the bounds feel "solid"
});

// Add Mapbox tile layer
L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_API_KEY}`, {
    attribution: '© <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
}).addTo(map);


// Fetch UFO Data using D3.js
// d3.json("/api/ufo_data").then(data => {
//     console.log("UFO Data Loaded:", data);  // Log data to console

//     // Limit the number of markers (e.g., first 500 sightings)
//     let maxSightings = 5000;
//     let limitedData = data.slice(0, maxSightings);

//     limitedData.forEach(d => {
//         if (d.latitude && d.longitude) { // Ensure lat/lon exists
//             L.marker([d.latitude, d.longitude])
//                 .addTo(map)
//                 .bindPopup(`
//                     <b>State:</b> ${d.state}<br>
//                     <b>Shape:</b> ${d.shape}<br>
//                     <b>Duration:</b> ${d["duration (seconds)"]} sec
//                 `);
//         }
//     });
// }).catch(error => {
//     console.error("Error loading JSON:", error);
// });

// Fetch UFO Data using D3.js and create a heatmap
d3.json("/api/ufo_data").then(data => {
    console.log("UFO Data Loaded:", data);  // Log data to console

    // Limit the number of markers (e.g., first 500 sightings)
    let maxSightings = 50000;
    let limitedData = data.slice(0, maxSightings);

    // Convert data into [lat, lon, intensity] format for heatmap
    let heatmapData = limitedData.map(d => {
        let lat = parseFloat(d.latitude);
        let lon = parseFloat(d.longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
            return [lat, lon, 1]; // Last value is intensity (can be adjusted)
        }
    }).filter(d => d !== undefined); // Remove invalid entries

    // Create the heatmap layer
    var heat = L.heatLayer(heatmapData, {
        radius: 6,  // Lower radius for more precision (previously 7)
        blur: 10,   // Slightly reduced blur to sharpen hotspots
        maxZoom: 10,
        gradient: {
            0.05: "#001f3f",  // Dark Space Blue (low activity)
            0.2: "#7DF9FF",   // Neon Electric Blue (alien presence)
            0.4: "#A020F0",   // Electric Purple (moderate activity)
            0.6: "#00FF00",   // Classic Alien Green (high activity)
            0.85: "#39FF14",  // Bright Neon Green (very high activity)
            1.0: "#ffffff"    // Pure White (UFO Hotspot)
        }
    }).addTo(map);

}).catch(error => {
    console.error("Error loading JSON:", error);
});