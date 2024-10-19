import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const LocationDisplay = ({ position }: { position: { lat: number, lng: number} }) => {
  return (
    <>
    <MapContainer
      // @ts-ignore
      center={[position.lat, position.lng]}
      zoom={17}
      scrollWheelZoom={false}
      style={{
        height: "500px",
        width: "100%"
      }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // @ts-ignore
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <Marker position={[position.lat, position.lng]}></Marker>
    </MapContainer>
    </>
  );
};

export default LocationDisplay;
