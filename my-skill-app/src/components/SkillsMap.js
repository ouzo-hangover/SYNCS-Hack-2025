import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // <-- Import Leaflet's CSS
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


const SkillsMap = ({ skillsToTeach }) => {
  // Leaflet uses an array [lat, lng] for coordinates
  const center = [-27.470, 153.023]; // Brisbane CBD

  return (
    <MapContainer center={center} zoom={12} style={{ height: '400px', width: '100%', borderRadius: '0.75rem' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {skillsToTeach.map(skill => (
        // The Marker position prop expects an array: [latitude, longitude]
        <Marker key={skill.id} position={[skill.location.lat, skill.location.lng]}>
          <Popup>
            <strong>{skill.title}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default SkillsMap;