import ImageCarousel from "@/components/ImageCarousel";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getLocation } from "@/functions/getmyLocation";
import { haversineDistance } from "@/functions/haversineDistance";
import Head from "next/head";
import Swal from "sweetalert2";
const LocationDisplay = dynamic(() => import("@/components/LocationDisplay"), { ssr: false });

const TableRow = ({ label, value }: { label: string, value: any }) => (
  <tr className="border-b">
    <td className="p-2 font-[500]">{label}</td>
    <td className="p-2 font-[500] text-gray-600">{value}</td>
  </tr>
);

export default function RescueItem({ item }: { item: RescueItem }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [myLocation, setMyLocation] = useState<any>(null);

  useEffect(() => {
    getLocation().then((location) => {
      setMyLocation(location);
    });
  }, [item]);

  const markAsRescued = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to mark this item as rescued?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, mark it!',
      cancelButtonText: 'No, cancel!'
    });

    if (result.isConfirmed) {
      try {
        await axios.post(`/api/MarkAsRescued`, { _id: id });
        Swal.fire('Success', 'Marked as Rescued', 'success');
        window.location.reload();
      } catch (error) {
        Swal.fire('Error', 'Failed to mark as rescued', 'error');
      }
    }
  }

  return (
    <>
      <Head>
        <title>{`${item.title} - Rescue`}</title>
      </Head>
      <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto">
        <div className={`flex flex-col md:w-1/2 m-4 relative rounded-xl`}>
          <ImageCarousel images={item.images} activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex} />
          {
            item.rescueStatus !== "Rescued" && myLocation && haversineDistance(myLocation, item.locationPosition) < 3 && (
              <div className="absolute top-4 right-4">
                <button onClick={() => markAsRescued(item._id)} className="bg-green-500 text-white p-2 rounded-lg">Mark as Rescued</button>
              </div>
            )
          }
        </div>
        <div className="flex flex-col md:w-1/2">
          <h1 className={`text-2xl font-[800] flex items-center gap-2`}>
            {item.title}
          </h1>

          <table className="w-full border mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Attribute</th>
                <th className="p-2">Value</th>
              </tr>
            </thead>
            <tbody>
              <TableRow label="Name" value={item.title} />
              <TableRow label="Category" value={item.animalType} />
              <TableRow label="Breed" value={item.animalBreed} />
              <TableRow label="Condition" value={item.status} />
              <TableRow label="Location" value={item.location} />
              <TableRow label="Landmark" value={item.landmark} />
              <TableRow label="Rescue&nbsp;Status" value={item.rescueStatus} />
                {
                  myLocation && (
                    <TableRow label="Distance" value={`About ${haversineDistance(myLocation, item.locationPosition)} KM Away`} />
                  )
                }
              <TableRow label="Posted By" value={<Link href={`/profile/${item.createdBy}`}>{item.op.name}</Link>} />
            </tbody>
          </table>
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <span className={`font-bold`}>Description: </span>
              <br />
              <span className={`font-[500] text-gray-600`}>
                {item.description}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col max-w-screen-xl mx-auto md:ml-4 md:mr-4 mt-4">
        <h2 className={`text-2xl font-[800] flex items-center gap-2 mb-2`}>
          Exact Location on Map
        </h2>
        <LocationDisplay position={item.locationPosition} myPosition={myLocation} />
      </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id;

  try {
    const item = await axios.get(`${process.env.NEXTAUTH_URL}/api/GetRescueItem?id=${id}`);
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