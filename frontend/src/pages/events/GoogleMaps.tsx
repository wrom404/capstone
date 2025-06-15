import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { useParams } from 'react-router-dom';


interface Coordinates {
  lat: number;
  lng: number;
}

function GeocoderControl() {

  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true
    })
      .on('markgeocode', function (e: any) {
        const latlng = e.geocode.center;
        map.setView(latlng, 15);
        L.marker(latlng).addTo(map).bindPopup(e.geocode.name).openPopup();
      })
      .addTo(map);

    return () => {
      map.removeControl(geocoder);
    };
  }, [map]);

  return null;
}

const fetchCoordinates = async (location: string): Promise<Coordinates | null> => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`);
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (err) {
    console.error('Geocoding failed:', err);
    return null;
  }
};

export default function SearchableMap() {
  const { locationName } = useParams() ?? 'Merida Church Leyte';
  const [coords, setCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    fetchCoordinates(locationName as string).then((result) => {
      if (result) {
        setCoords(result);
      }
    });
  }, []);

  return coords ? (
    <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[coords.lat, coords.lng]}>
        <Popup>{locationName}</Popup>
      </Marker>
      <GeocoderControl />
    </MapContainer>
  ) : (
    <div className="flex justify-center items-center flex-col h-screen">
      <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mb-2"></div>
      <p>Loading map for "{locationName}"...</p>
    </div>
  );
}
