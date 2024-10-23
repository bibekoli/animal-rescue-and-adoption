import Image from "next/image";
import Hero from "@/components/Hero";
import Head from "next/head";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { getLocation } from "@/functions/getmyLocation";
import { useEffect, useState } from "react";
import { haversineDistance } from "@/functions/haversineDistance";
import dynamic from "next/dynamic";
const DisplayAllInMap = dynamic(() => import("@/components/DisplayAllInMap"), { ssr: false });

export default function AdoptionItems({ adoptionLists }: { adoptionLists: AdoptionItem[] }) {
  const [myLocation, setMyLocation] = useState<any>(null);

  useEffect(() => {
    adoptionLists.sort((a, b) => {
      if (a.locationPosition && b.locationPosition && myLocation) {
        return haversineDistance(myLocation, a.locationPosition) - haversineDistance(myLocation, b.locationPosition);
      }
      return 0;
    });
  }, [myLocation]);

  useEffect(() => {
    getLocation().then((location) => {
      setMyLocation(location);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Listed For Adoption</title>
      </Head>
      {/* Adoption Items */}
      <div className="container mx-auto py-4">
        <h2 className="text-2xl font-bold">List of Animals Listed For Adoption</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {adoptionLists.map((adoption: any) => (
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
          ))}
        </div>
      </div>

      <DisplayAllInMap
        locations={adoptionLists.map((adoption) => ({
          href: `/adoption/${adoption._id}`,
          image: `https://wsrv.nl?url=${adoption.images[0]}&w=500&h=500&fit=cover&a=attention`,
          name: adoption.title,
          location: adoption.locationPosition
        }))}
        myPosition={myLocation}
      />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const adoptionLists = await axios.get(`${process.env.NEXTAUTH_URL}/api/GetAllAdoptionLists`);
    return {
      props: {
        adoptionLists: adoptionLists.data,
      },
    };
  }
  catch (error) {
    console.log(error);
    return {
      props: {
        adoptionLists: [],
      }
    };
  }
}
