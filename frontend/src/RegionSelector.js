import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const RegionSelector = ({ className, regions, onRegionSelect }) => {
    useEffect(() => {
        // Create a map instance
        const map = L.map('map').setView([37.7749, -122.4194], 10); // Coordinates for San Francisco

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 12,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Define locations with emojis
        const locations = [
            { latLng: [37.7749, -122.4194], emoji: '📍', label: 'San Francisco' }, // Golden Gate Bridge emoji
            { latLng: [37.3382, -121.8863], emoji: '📍', label: 'San Jose' },     // Buildings emoji
            { latLng: [38.5816, -121.4944], emoji: '📍', label: 'Sacramento' },  // Government Building emoji
            { latLng: [37.8044, -122.2712], emoji: '📍', label: 'Oakland' }       // Tree emoji
        ];

        // Add emoji markers to the map
        locations.forEach(loc => {
            const emojiIcon = L.divIcon({
                html: `<span style="font-size: 1.5em;">${loc.emoji}</span>`,
                iconSize: [30, 30],
                className: 'emoji-icon'
            });
            L.marker(loc.latLng, { icon: emojiIcon })
                .addTo(map)
                .bindPopup(loc.label);
        });

        return () => map.remove();
    }, []);

    return (
        <div className={`${className} region-selector`}>
            <h2>Select a Region:</h2>
            <div id="map" style={{ height: '400px', width: '100%' }}></div>
            {regions.map((region) => (
                <button key={region.region} onClick={() => onRegionSelect(region)}>
                    {region.region}
                </button>
            ))}
        </div>
    );
};

export default RegionSelector;
