import axios from "axios";
import Swal from "sweetalert2";

export default async function parseLocation(lat: number, lng: number) {
  const apiKeys = [
    "pk.0aabf36d701ff7d32567e3b40759e7a3",
    "pk.681baf14fb7dee6d8cb9170cb1ce3b99"
  ];

  try {
    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    const position = await axios.get(`https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`);
    const locationName = position.data.display_name;
    return locationName;
  }
  catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Data not found for given location",
    });
  }
}