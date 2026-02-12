import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function MapComponent() {
  const disasterZones = [
    { id: 1, name: 'Flood Zone 1', position: [51.505, -0.09] },
    { id: 2, name: 'Earthquake Zone 1', position: [51.515, -0.1] },
  ];

  return (
    <div className="h-96">
      <MapContainer center={[51.505, -0.09]} zoom={6} className="h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {disasterZones.map((zone) => (
          <Marker key={zone.id} position={zone.position}>
            <Popup>{zone.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
