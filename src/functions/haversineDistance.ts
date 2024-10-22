export function haversineDistance(coord1: Coordinate, coord2: Coordinate): number {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;

  const { lat: lat1, lng: lng1 } = coord1;
  const { lat: lat2, lng: lng2 } = coord2;

  const R = 6371;

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lng2 - lng1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return Math.round(distance * 100) / 100;
}

type Coordinate = { lat: number, lng: number };