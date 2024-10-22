import Image from "next/image";
import Head from "next/head";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { getLocation } from "@/functions/getmyLocation";
import { useEffect, useState } from "react";
import { haversineDistance } from "@/functions/haversineDistance";
import dynamic from "next/dynamic";
const DisplayAllInMap = dynamic(() => import("@/components/DisplayAllInMap"), { ssr: false });

export default function RescueCenters({ rescueCenters }: { rescueCenters: RescueCenter[] }) {
  const [myLocation, setMyLocation] = useState<any>(null);

  useEffect(() => {
    getLocation().then((location) => {
      setMyLocation(location);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Resscue Centers</title>
      </Head>
      {/* Rescue Centers */}
      <div className="container mx-auto py-12">
        <h2 className="text-2xl font-bold">Rescue Centers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {rescueCenters.map((center: any) => (
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

      <DisplayAllInMap
        locations={rescueCenters.map((rescue) => ({
          href: `/rescue/${rescue._id}`,
          image: `https://wsrv.nl?url=${rescue.images[0]}&w=500&h=500&fit=cover&a=attention`,
          name: rescue.name,
          location: rescue.locationPosition
        }))}
        myPosition={myLocation}
      />
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
