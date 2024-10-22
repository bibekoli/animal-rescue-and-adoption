type RescueCenter = {
  _id: string;
  name: string;
  description: string;
  contactNumber: string;
  location: string;
  locationPosition: {
      lat: number;
      lng: number;
  };
  landmark: string;
  images: string[];
  createdBy: string;
  createdAt: string;
  members: string[];
};

type RescueItem = {
  _id: string;
  title: string;
  description: string;
  location: string;
  locationPosition: {
      lat: number;
      lng: number;
  };
  landmark: string;
  animalType: string;
  animalBreed: string;
  status: string;
  images: string[];
  createdBy: string;
  createdAt: string;
  rescueStatus: string;
  rescuedBy: string;
  rescuedAt: string;
};


type AdoptionItem = {
  _id: string;
  title: string;
  age: string;
  vaccinated: string;
  description: string;
  location: string;
  locationPosition: {
      lat: number;
      lng: number;
  };
  landmark: string;
  animalType: string;
  animalBreed: string;
  status: string;
  images: string[];
  reasonForListing: string;
  adoptionStatus: string;
  ownerContact: string;
  createdBy: string;
  createdAt: string;
  gender: string;
  animalBehavior: string;
  adoptedAt: string;
};
