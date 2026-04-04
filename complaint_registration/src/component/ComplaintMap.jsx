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
function LocationMarker({ setLatitude, setLongitude, position, setPosition }) {
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
  }, [position]);

  return null;
}

function LocationPicker({
  setLatitude,
  setLongitude,
  position,
  setPosition,
}) {
  // 📍 GPS function
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported ❌");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);
        setPosition({ lat, lng });
      },
      (err) => {
        console.log(err);
        alert("Failed to get location ❌");
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {/* 🔥 GPS BUTTON */}
      <button type="button" onClick={handleUseMyLocation}>
        📍 Use My Location
      </button>

      <p style={{ marginTop: "5px" }}>
        👉 Or click on map to select location
      </p>

      <div
        style={{ height: "400px", width: "100%", overflow: "hidden" }}
        onWheel={(e) => e.stopPropagation()}
      >
        <MapContainer
          center={[19.076, 72.8777]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          dragging={true}
          doubleClickZoom={true}
          touchZoom={true}
          tap={false}
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

          {/* 🔥 Auto move map */}
          <ChangeView position={position} />
        </MapContainer>
      </div>
    </div>
  );
}

export default LocationPicker;