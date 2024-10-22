import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { TextInput } from "@/pages/new/rescue";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Router from "next/router";
const LocationPicker = dynamic(() => import("@/components/LocationPicker"), { ssr: false });
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import parseLocation from "@/functions/parseLocation";


export default function AdoptionItem({ item }: { item: RescueCenter }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationPosition, setLocationPosition] = useState<any>(null);
  const [landmark, setLandmark] = useState("");
  const [nameError, setNameError] = useState(false);
  const [contactNumberError, setContactNumberError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [imageError, setImageError] = useState(false);

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
      setName(item.name);
      setContactNumber(item.contactNumber);
      setDescription(item.description);
      setLocation(item.location);
      setLocationPosition(item.locationPosition);
      setLandmark(item.landmark);
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

    if (name.trim() === "") {
      setNameError(true);
      error = true;
    }

    if (contactNumber.trim() === "") {
      setContactNumberError(true);
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

    if (error) return;

    const itemData = {
      _id: item._id,
      name: name.trim(),
      description: description.trim(),
      contactNumber: contactNumber.trim(),
      location: location.trim(),
      locationPosition: locationPosition,
      landmark: landmark.trim(),
      images: images,
      createdBy: data.data?.user?.email
    }

    setSaving(true);

    axios.post("/api/UpdateRescueCenter", itemData)
    .then((response) => {
      Router.push("/rescue-center/" + response.data._id);
    })
    .catch((error) => {
      alert(error.response.data.message);
      setSaving(false);
    });
  }

  return (
    <>
      <Head>
        <title>Update Rescue Center</title>
      </Head>
      <h1 className="text-2xl font-semibold mb-4">Update Rescue Center</h1>
      <div className="max-w-screen-xl mx-auto">
        <div className="rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              {/* Name */}
              <TextInput
                required
                type="text"
                label="Name"
                placeholder="e.g. Eastern Nepal Animal Rescue Center"
                error={nameError}
                setError={setNameError}
                value={name}
                onChange={(e: any) => {
                  setName(e.target.value);
                  setNameError(false);
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

              {/* Contact Number */}
              <TextInput
                required
                type="text"
                label="Contact Number"
                placeholder="e.g. 98XXXXXXXX"
                error={contactNumberError}
                setError={setContactNumberError}
                value={contactNumber}
                onChange={(e: any) => {
                  setContactNumber(e.target.value);
                  setContactNumberError(false);
                }}
              />
            </div>

            <div className="flex flex-col gap-4">
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
    const item = await axios.get(`${process.env.NEXTAUTH_URL}/api/GetRescueCenter?id=${id}`);
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