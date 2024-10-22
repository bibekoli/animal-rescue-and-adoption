import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DropDown, TextInput } from "@/pages/new/rescue";
const LocationPicker = dynamic(() => import("@/components/LocationPicker"), { ssr: false });
import Router from "next/router";
import Swal from "sweetalert2";
import parseLocation from "@/functions/parseLocation";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function AdoptionItem({ item }: { item: AdoptionItem }) {
  const [title, setTitle] = useState("");
  const [age, setAge] = useState("");
  const [vaccinated, setVaccinated] = useState("Regularly Vaccinated");
  const [reasonForListing, setReasonForListing] = useState("");
  const [gender, setGender] = useState("Male");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationPosition, setLocationPosition] = useState<any>(null);
  const [landmark, setLandmark] = useState("");
  const [animalType, setAnimalType] = useState("Dog");
  const [animalBreed, setAnimalBreed] = useState("");
  const [animalBehavior, setAnimalBehavior] = useState("Normal");
  const [status, setStatus] = useState("Injured");
  const [ownerContact, setOwnerContact] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const [titleError, setTitleError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const [imageError, setImageError] = useState(false);
  const [saving, setSaving] = useState(false);

  const data = useSession();

  useEffect(() => {
    if (data && data.status === "loading") return;
    if (data && data.status === "unauthenticated") {
      Router.push("/auth/login");
    }
  }, [data]);

  useEffect(() => {
    if (locationPosition) {
      parseLocation(locationPosition.lat, locationPosition.lng)
      .then((data) => {
        setLocation(data);
        setLocationError(false);
      });
    }
  }, [locationPosition]);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setAge(item.age);
      setVaccinated(item.vaccinated);
      setReasonForListing(item.reasonForListing);
      setGender(item.gender);
      setDescription(item.description);
      setLocation(item.location);
      setLocationPosition(item.locationPosition);
      setLandmark(item.landmark);
      setAnimalType(item.animalType);
      setAnimalBreed(item.animalBreed);
      setAnimalBehavior(item.animalBehavior);
      setStatus(item.status);
      setOwnerContact(item.ownerContact);
      setImages(item.images);
    }
  }, [item]);

  const handleImageUpload = (e: any) => {
    const files = e.target.files;
    if (files.length === 0) return;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]) as any;

    reader.onload = () => {
      setUploadingImage(true);
      setImageError(false);
      fetch("/api/UploadImage", {
        method: "POST",
        body: JSON.stringify({
          image: reader.result ? (reader.result as string).replace(/data:.*base64,/, "") : "",
          type: "rescur-item"
        })
      })
      .then((res) => res.json())
      .then((data) => {
        setUploadingImage(false);
        if (data.image) {
          setImages((prev: string[]) => [...prev, data.image]);
        }
        if (data.message) {
          Swal.fire({
            title: "Error",
            text: data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => {
        setUploadingImage(false);
      });
    }
    // clear the input
    e.target.value = null;
  }

  const addItem = () => {
    let error = false;

    if (title.trim() === "") {
      setTitleError(true);
      error = true;
    }

    if (description.trim() === "") {
      setDescriptionError(true);
      error = true;
    }

    if (location.trim() === "") {
      setLocationError(true);
      error = true;
    }

    if (images.length === 0) {
      setImageError(true);
      error = true;
    }

    if (age.trim() === "") {
      setAgeError(true);
      error = true;
    }

    if (error) return;

    const updateItem = {
      _id: item._id,
      title: title.trim(),
      age: age.trim(),
      gender: gender,
      vaccinated: vaccinated,
      description: description.trim(),
      location: location.trim(),
      locationPosition: locationPosition,
      landmark: landmark.trim(),
      animalType: animalType,
      animalBreed: animalBreed.trim(),
      animalBehavior: animalBehavior,
      status: status,
      images: images,
      reasonForListing: reasonForListing,
      ownerContact: ownerContact,
      createdBy: data.data?.user?.email,
    }

    setSaving(true);

    axios.post("/api/UpdateAdoptionItem", updateItem)
    .then((response) => {
      Router.push("/adoption/" + response.data._id);
    })
    .catch((error) => {
      alert(error.response.data.message);
      setSaving(false);
    });
  }

  return (
    <>
      <Head>
        <title>List For Adoption</title>
      </Head>
      <h1 className="text-2xl font-semibold mb-4">List For Adoption</h1>
      <div className="max-w-screen-xl mx-auto">
        <div className="rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              {/* Name */}
              <TextInput
                required
                type="text"
                label="Title"
                placeholder="e.g. Cute White Puppy"
                error={titleError}
                setError={setTitleError}
                value={title}
                onChange={(e: any) => {
                  setTitle(e.target.value);
                  setTitleError(false);
                }}
              />

              {/* Description */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold required">Description *</span>
                </label>
                <textarea
                  className={`textarea textarea-bordered ${descriptionError && "textarea-error"} rounded-md h-[150px] resize-none`}
                  placeholder="Description"
                  rows={8}
                  value={description}
                  onChange={e => {
                    setDescription(e.target.value);
                    setDescriptionError(false);
                  }}
                />
              </div>

              {/* Animal Type */}
              <DropDown
                label="Animal Type"
                required
                value={animalType}
                onChange={(e: any) => setAnimalType(e.target.value)}
                options={[
                  "Alligator", "Antelope", "Armadillo", "Bat", "Bear", "Beaver", "Bird", "Bobcat",
                  "Buffalo", "Camel", "Caracal", "Cat", "Chicken", "Chinchilla", "Cow", "Coyote", "Deer",
                  "Dog", "Duck", "Eagle", "Elk", "Ferret", "Fish", "Fox", "Frog", "Goat", "Goose",
                  "Guinea Pig", "Hamster", "Hawk", "Hedgehog", "Horse", "Iguana", "Jackal",
                  "Kangaroo", "Leopard", "Lizard", "Lynx", "Mink", "Mole", "Monkey", "Mongoose",
                  "Ocelot", "Otter", "Owl", "Panther", "Parrot", "Peacock", "Pigeon", "Pig",
                  "Porcupine", "Possum", "Prairie Dog", "Rabbit", "Raccoon", "Reindeer", "Sheep",
                  "Skunk", "Snake", "Squirrel", "Swan", "Toad", "Tortoise", "Turtle", "Turkey",
                  "Wallaby", "Wolf", "Other"
                ]}
              />

              {/* Gender */}
              <DropDown
                label="Gender"
                required
                value={gender}
                onChange={(e: any) => setGender(e.target.value)}
                options={[
                  "Male",
                  "Female",
                  "Male Neutered",
                  "Female Spayed",
                  "Other"
                ]}
              />

              {/* Animal Breed */}
              <TextInput
                type="text"
                label="Animal Breed"
                placeholder="e.g. German Shepherd"
                value={animalBreed}
                onChange={(e: any) => setAnimalBreed(e.target.value)}
              />

              {/* Behavior */}
              <DropDown
                label="Behavior"
                required
                value={animalBehavior}
                onChange={(e: any) => setAnimalBehavior(e.target.value)}
                options={[
                  "Normal", "Aggressive", "Friendly", "Scared", "Aggressive to other animals", "Aggressive to strangers", "Shy", "Other"
                ]}
              />

              {/* Age */}
              <TextInput
                type="text"
                label="Age"
                placeholder="e.g. 2 years"
                value={age}
                onChange={(e: any) => {
                  setAge(e.target.value);
                  setAgeError(false);
                }}
                error={ageError}
                setError={setAgeError}
                required
              />

              {/* Status */}
              <DropDown
                label="Status"
                required
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                options={[
                  "Healthy", "Pregnant", "Sick", "Injured", "Other"
                ]}
              />
            </div>

            <div className="flex flex-col gap-4">
              {/* Vaccination Status */}
              <DropDown
                label="Vaccination Status"
                required
                value={vaccinated}
                onChange={(e: any) => setVaccinated(e.target.value)}
                options={[
                  "Regularly Vaccinated", "Not Vaccinated", "Partially Vaccinated", "Unknown"
                ]}
              />

              {/* Reason For Listing */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold required">Reason For Listing</span>
                </label>
                <textarea
                  className={`textarea textarea-bordered rounded-md h-[150px] resize-none`}
                  placeholder="e.g. No longer able to take care of the animal"
                  rows={8}
                  value={reasonForListing}
                  onChange={e => {
                    setReasonForListing(e.target.value);
                  }}
                />
              </div>

              {/* Owner Contact */}
              <TextInput
                type="text"
                label="Owner Contact"
                placeholder="e.g. 021-123456"
                value={ownerContact}
                onChange={(e: any) => setOwnerContact(e.target.value)}
              />

              {/* Images */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold required">Images *</span>
                </label>
                <div className="flex flex-row items-start overflow-x-auto gap-4 no-scrollbar">
                  <div className={`card h-[150px] ${images.length === 0 ? "w-full" : "w-[150px]"} rounded-md border-2 border-dashed ${imageError ? "border-red-500" : "border-gray-300"} flex flex-col justify-center items-center`}>
                    <label htmlFor="image-upload" className={`cursor-pointer text-4xl text-gray-300 ${images.length === 0 ? "w-full" : "w-[150px]"} h-full flex flex-col justify-center items-center gap-2`}>
                      {
                        uploadingImage ? (
                          <>
                            <Icon icon="line-md:uploading-loop" width={60} height={60} />
                          </>
                        ) : (
                          <>
                            <Icon icon="zondicons:add-outline" width={40} height={40} />
                            <span className="text-sm font-semibold text-gray-400">Add Images</span>
                          </>
                        )
                      }
                    </label>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                    />
                  </div>
                  {
                    images.map((image, index) => (
                      <div key={index} className="relative w-[150px] h-[150px] bg-white rounded-md border-2 border-gray-300 flex-shrink-0">
                        <Image src={"https://wsrv.nl?url=" + image + "&w=200&h=200&fit=cover&a=attention"} className="w-full h-full rounded-md object-cover" alt={`Image ${index}`} width={150} height={150} />
                        <div className="absolute top-0 right-0 p-1">
                          <button className="btn btn-xs btn-circle text-white bg-red-500 hover:bg-red-600" onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}>
                            <Icon icon="maki:cross" width={14} height={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Location */}
              <div className="flex justify-between gap-2 items-end">
                <TextInput
                  required
                  type="text"
                  label="Location"
                  readonly
                  placeholder="e.g. Birtamod, Jhapa"
                  error={locationError}
                  setError={setLocationError}
                  value={location}
                  onChange={(e: any) => {
                    setLocation(e.target.value);
                    setLocationError(false);
                  }}
                />
                {/* @ts-expect-error error expected */}
                <button className="btn btn-square rounded-md" onClick={()=>document.getElementById('my_modal_1')?.showModal()}>
                  <Icon icon="akar-icons:location" width={20} height={20} />
                </button>
              </div>

              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Choose Location</h3>
                    <form method="dialog">
                      <button className="btn btn-xs">Close</button>
                    </form>
                  </div>
                  <LocationPicker
                    position={locationPosition}
                    setPosition={setLocationPosition}
                  />
                </div>
              </dialog>

              {/* LandMark */}
              <TextInput
                type="text"
                label="Landmark"
                placeholder="e.g. Near the big tree"
                value={landmark}
                onChange={(e: any) => setLandmark(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button className="btn btn-primary text-white rounded-lg" onClick={addItem} disabled={saving}>
              {
                saving ? (
                  <>
                    <Icon icon="gg:spinner-two-alt" width={20} height={20} className="animate-spin" />
                    <span>Update</span>
                  </>
                ) : (
                  <>
                    <Icon icon="ant-design:save-outlined" width={20} height={20} />
                    <span>Update</span>
                  </>
                )
              }
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id;

  try {
    const item = await axios.get(`${process.env.NEXTAUTH_URL}/api/GetAdoptionItem?id=${id}`);
    return {
      props: {
        item: item.data,
      },
    };
  }
  catch (error) {
    console.log(error);
    return {
      props: {}
    };
  }
}