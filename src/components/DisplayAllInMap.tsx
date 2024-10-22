import { Icon } from "@iconify/react/dist/iconify.js";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface Position {
  lat: number;
  lng: number;
}

interface Location {
  image: string;
  href: string;
  name: string;
  location: Position;
}

interface LocationDisplayProps {
  locations: Location[];  // Array of locations
  myPosition: Position;   // User's current position
}

const DisplayAllInMap = ({ locations, myPosition }: LocationDisplayProps) => {
  if (!myPosition || !locations || locations.length === 0) {
    return null;
  }

  return (
    <>
      <MapContainer
        // @ts-expect-error error expected
        center={[myPosition.lat, myPosition.lng]}
        zoom={11}
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

        {/* Marker for user's current position */}
        <Marker position={[myPosition.lat, myPosition.lng]}>
          <Popup>My Location</Popup>
        </Marker>

        {/* Markers for all locations */}
        {locations.map((loc, index) => {
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${myPosition.lat},${myPosition.lng}&destination=${loc.location.lat},${loc.location.lng}&travelmode=driving`;
          return (
            <Marker key={index} position={[loc.location.lat, loc.location.lng]}>
              <Popup>
                <Image
                  src={loc.image}
                  alt={loc.name}
                  width={500}
                  height={500}
                  objectFit="cover"
                />
                {loc.name} <br />
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm rounded-md text-white flex w-36">
                  <Icon icon="pepicons-pencil:map" /> View In Map
                </a>
                <Link className="btn btn-sm rounded-md text-white flex w-36 mt-2" href={loc.href}>
                  <Icon icon="akar-icons:eye" /> View Details
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};

export default DisplayAllInMap;
