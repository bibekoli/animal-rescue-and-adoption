import Image from "next/image";
import Hero from "@/components/Hero";
import Head from "next/head";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { getLocation } from "@/functions/getmyLocation";
import { useEffect, useState } from "react";
import { haversineDistance } from "@/functions/haversineDistance";

export default function Home({ rescueLists, adoptionLists, rescueCenters }: { rescueLists: RescueItem[], adoptionLists: AdoptionItem[], rescueCenters: RescueCenter[] }) {
  const [myLocation, setMyLocation] = useState<any>(null);
  const [sortedRescueLists, setSortedRescueLists] = useState<RescueItem[]>(rescueLists);
  const [sortedAdoptionLists, setSortedAdoptionLists] = useState<AdoptionItem[]>(adoptionLists);
  const [sortedRescueCenters, setSortedRescueCenters] = useState<RescueCenter[]>(rescueCenters);

  useEffect(() => {
    // rescueLists.sort((a, b) => {
    //   if (a.locationPosition && b.locationPosition && myLocation) {
    //     return haversineDistance(myLocation, a.locationPosition) - haversineDistance(myLocation, b.locationPosition);
    //   }
    //   return 0;
    // });
    const sortedData = rescueLists.sort((a, b) => {
      if (a.locationPosition && b.locationPosition && myLocation) {
        return haversineDistance(myLocation, a.locationPosition) - haversineDistance(myLocation, b.locationPosition);
      }
      return 0;
    }
    );
    setSortedRescueLists(sortedData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myLocation]);

  useEffect(() => {
    // adoptionLists.sort((a, b) => {
    //   if (a.locationPosition && b.locationPosition && myLocation) {
    //     return haversineDistance(myLocation, a.locationPosition) - haversineDistance(myLocation, b.locationPosition);
    //   }
    //   return 0;
    // });
    const sortedData = adoptionLists.sort((a, b) => {
      if (a.locationPosition && b.locationPosition && myLocation) {
        return haversineDistance(myLocation, a.locationPosition) - haversineDistance(myLocation, b.locationPosition);
      }
      return 0;
    }
    );
    setSortedAdoptionLists(sortedData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myLocation]);

  useEffect(() => {
    // rescueCenters.sort((a, b) => {
    //   if (a.locationPosition && b.locationPosition && myLocation) {
    //     return haversineDistance(myLocation, a.locationPosition) - haversineDistance(myLocation, b.locationPosition);
    //   }
    //   return 0;
    // });

    const sortedData = rescueCenters.sort((a, b) => {
      if (a.locationPosition && b.locationPosition && myLocation) {
        return haversineDistance(myLocation, a.locationPosition) - haversineDistance(myLocation, b.locationPosition);
      }
      return 0;
    }
    );
    setSortedRescueCenters(sortedData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myLocation]);

  useEffect(() => {
    getLocation().then((location) => {
      setMyLocation(location);
    });
  }, []);

  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <Hero />
      {/* Rescue Items */}
      <div className="container mx-auto py-12">
        <h2 className="text-2xl font-bold">Rescue Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {sortedRescueLists.map((rescue) => {
            if (rescue.rescueStatus === "Rescued") {
              return null;
            }
            return (
            <Link href={`/rescue/${rescue._id}`} key={rescue._id}>
              <div
                key={rescue._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden">
                <Image
                  src={`https://wsrv.nl?url=${rescue.images[0]}&w=500&h=500&fit=cover&a=attention`}
                  alt={rescue.title}
                  width={500}
                  height={500}
                  objectFit="cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-xl">{rescue.title}</h3>
                  <div className="mt-4">
                    <p>
                      <span className="font-bold">Category: </span>
                      {rescue.animalType}
                    </p>
                    <p>
                      <span className="font-bold">Location: </span>
                      {rescue.location}
                    </p>
                    <p>
                      <span className="font-bold">Condition: </span>
                      {rescue.status}
                    </p>
                    <p>
                      <span className="font-bold">Rescue Status: </span>
                      {rescue.rescueStatus}
                    </p>
                    {
                      myLocation && (
                        <p>
                          <span className="font-bold">Distance: </span>
                          About {haversineDistance(myLocation, rescue.locationPosition)} KM Away
                        </p>
                      )
                    }
                  </div>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </div>

      {/* Adoption Items */}
      <div className="container mx-auto py-12">
        <h2 className="text-2xl font-bold">Adoption Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {sortedAdoptionLists.map((adoption) => {
            if (adoption.adoptionStatus === "Adopted") {
              return null;
            }
            return (
              <Link href={`/adoption/${adoption._id}`} key={adoption._id}>
                <div
                  key={adoption._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <Image
                    src={`https://wsrv.nl?url=${adoption.images[0]}&w=500&h=500&fit=cover&a=attention`}
                    alt={adoption.title}
                    width={500}
                    height={500}
                    objectFit="cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-xl">{adoption.title}</h3>
                    <div className="mt-4">
                      <p>
                        <span className="font-bold">Category: </span>
                        {adoption.animalType}
                      </p>
                      <p>
                        <span className="font-bold">Location: </span>
                        {adoption.location}
                      </p>
                      <p>
                        <span className="font-bold">Age: </span>
                        {adoption.age}
                      </p>
                      <p>
                        <span className="font-bold">Vaccinated: </span>
                        {adoption.vaccinated}
                      </p>
                      <p>
                        <span className="font-bold">Adoption Status: </span>
                        {adoption.adoptionStatus}
                      </p>
                      {
                        myLocation && (
                          <p>
                            <span className="font-bold">Distance: </span>
                            About {haversineDistance(myLocation, adoption.locationPosition)} KM Away
                          </p>
                        )
                      }
                    </div>
                  </div>
                </div>
              </Link>
            );
          }
          )}
        </div>
      </div>

      {/* Rescue Centers */}
      <div className="container mx-auto py-12">
        <h2 className="text-2xl font-bold">Rescue Centers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {sortedRescueCenters.map((center) => (
            <Link href={`/rescue-center/${center._id}`} key={center._id}>
            <div
              key={center._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Image
                src={`https://wsrv.nl?url=${center.images[0]}&w=500&h=500&fit=cover&a=attention`}
                alt={center.name}
                width={500}
                height={500}
                objectFit="cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-xl">{center.name}</h3>
                <div className="mt-4">
                  <p>
                    <span className="font-bold">Contact Number: </span>
                    {center.contactNumber}
                  </p>
                  <p>
                    <span className="font-bold">Location: </span>
                    {center.location}
                  </p>
                  <p>
                    <span className="font-bold">Landmark: </span>
                    {center.landmark}
                  </p>
                  {
                    myLocation && (
                      <p>
                        <span className="font-bold">Distance: </span>
                        About {haversineDistance(myLocation, center.locationPosition)} KM Away
                      </p>
                    )
                  }
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>

    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const rescueLists = await axios.get(`${process.env.NEXTAUTH_URL}/api/GetAllRescueLists`);
    const adoptionLists = await axios.get(`${process.env.NEXTAUTH_URL}/api/GetAllAdoptionLists`);
    const rescueCenters = await axios.get(`${process.env.NEXTAUTH_URL}/api/GetAllRescueCenters`);
    return {
      props: {
        rescueLists: rescueLists.data,
        adoptionLists: adoptionLists.data,
        rescueCenters: rescueCenters.data,
      },
    };
  }
  catch (error) {
    console.log(error);
    return {
      props: {
        rescueLists: [],
        adoptionLists: [],
        rescueCenters: [],
      }
    };
  }
}
