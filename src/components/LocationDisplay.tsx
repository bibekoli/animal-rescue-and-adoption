import { Icon } from "@iconify/react/dist/iconify.js";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface Position {
  lat: number;
  lng: number;
}

interface LocationDisplayProps {
  position: Position;
  myPosition: Position;
}

const LocationDisplay = ({ position, myPosition }: LocationDisplayProps) => {
  if (!myPosition || !position) {
    return null;
  }

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${myPosition.lat},${myPosition.lng}&destination=${position.lat},${position.lng}&travelmode=driving`;

  return (
    <>
      <MapContainer
        // @ts-expect-error error expected
        center={[position.lat, position.lng]}
        zoom={18}
        scrollWheelZoom={false}
        style={{
          height: "500px",
          width: "100%",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // @ts-expect-error error expected
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />

        <Marker position={[myPosition.lat, myPosition.lng]}>
          <Popup>My Location</Popup>
        </Marker>

        <Marker position={[position.lat, position.lng]}>
          <Popup>Target Location</Popup>
        </Marker>
      </MapContainer>

      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm rounded-md text-white">
          <Icon icon="pepicons-pencil:map" style={{ fontSize: "24px" }} />
          Open in Google Maps
        </a>
      </div>
    </>
  );
};

export default LocationDisplay;
