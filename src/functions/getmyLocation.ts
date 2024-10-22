import Swal from "sweetalert2";

export async function getLocation() {
  if (process.env.MONGODB_NAME || !navigator) {
    return null;
  }

  if (navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }) as GeolocationPosition;

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      return { lat, lng };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Location Error',
        text: 'Unable to retrieve your location',
      });
      return null;
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Geolocation not supported',
      text: 'Your browser does not support geolocation.',
    });
    return null;
  }
}

// Example usage:
(async () => {
  const coords = await getLocation();
  if (coords) {
    console.log(`Latitude: ${coords.lat}, Longitude: ${coords.lng}`);
  }
})();
