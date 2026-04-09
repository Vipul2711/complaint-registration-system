import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "../leafletFix";

// 📍 Marker + Click handler
function LocationMarker({
  setLatitude,
  setLongitude,
  position,
  setPosition,
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLatitude(lat);
      setLongitude(lng);
      setPosition({ lat, lng });
    },
  });

  return position ? <Marker position={position} /> : null;
}

// 🎯 Move map when position changes
function ChangeView({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], 15, {
        animate: true,
      });
    }
  }, [position, map]);

  return null;
}

function LocationPicker({
  setLatitude,
  setLongitude,
  position,
  setPosition,
}) {
  return (
    <div className="w-full">
      {/* Map Container */}
      <div
        className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm"
        onWheel={(e) => e.stopPropagation()}
      >
        <MapContainer
          center={[19.076, 72.8777]}
          zoom={13}
          className="h-full w-full z-0"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker
            setLatitude={setLatitude}
            setLongitude={setLongitude}
            position={position}
            setPosition={setPosition}
          />

          <ChangeView position={position} />
        </MapContainer>
      </div>
    </div>
  );
}

export default LocationPicker;