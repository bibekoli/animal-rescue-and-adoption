import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const LocationPicker = ({ position, setPosition }: { position: any, setPosition: any }) => {
  function LocationMarker() {
    useMapEvents({
      click(event: any) {
        setPosition(event.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  }

  return (
    <>
    <MapContainer
      // @ts-expect-error error expected
      center={[26.64316263704834, 87.99233436584473]}
      zoom={15}
      style={{
        height: "300px",
        width: "100%"
      }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // @ts-expect-error error expected
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <LocationMarker />
    </MapContainer>
    </>
  );
};

export default LocationPicker;
