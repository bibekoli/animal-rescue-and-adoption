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

export default function RescueLists({ rescueLists }: { rescueLists: RescueItem[] }) {
  const [myLocation, setMyLocation] = useState<any>(null);

  useEffect(() => {
    rescueLists.sort((a, b) => {
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
        <title>Listed For Rscue</title>
      </Head>
      {/* Rescue Items */}
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold">List of Animals For Rescue</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {rescueLists.map((rescue: any) => (
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
          ))}
        </div>
      </div>

      <DisplayAllInMap
        locations={rescueLists.map((rescue) => ({
          href: `/rescue/${rescue._id}`,
          image: `https://wsrv.nl?url=${rescue.images[0]}&w=500&h=500&fit=cover&a=attention`,
          name: rescue.title,
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
    return {
      props: {
        rescueLists: rescueLists.data,
      },
    };
  }
  catch (error) {
    console.log(error);
    return {
      props: {
        rescueLists: [],
      }
    };
  }
}
