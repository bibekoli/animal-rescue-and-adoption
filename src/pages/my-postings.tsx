import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import Swal from 'sweetalert2';

type MyPostings = {
  rescueList: RescueItem[];
  adoptionList: AdoptionItem[];
  rescueCenters: RescueCenter[];
}

export default function MyPostings({ myPostings }: { myPostings: MyPostings }) {
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

  const markAsAdopted = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to mark this item as adopted?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, mark it!',
      cancelButtonText: 'No, cancel!'
    });

    if (result.isConfirmed) {
      try {
        await axios.post(`/api/MarkAsAdopted`, { _id: id });
        Swal.fire('Success', 'Marked as Adopted', 'success');
        window.location.reload();
      } catch (error) {
        Swal.fire('Error', 'Failed to mark as adopted', 'error');
      }
    }
  }

  return (
    <>
    <Head>
      <title>My Postings</title>
    </Head>
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">My Postings</h1>

      <div className="space-y-8">
        {/* Rescue List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Rescue List</h2>
          <div className="space-y-4">
            {myPostings.rescueList.map((rescueItem) => (
              <div
                key={rescueItem._id}
                className="border border-gray-300 rounded-lg p-4 flex justify-between items-center"
              >
                <div className='flex gap-4 items-center'>
                  <Image
                    src={`https://wsrv.nl?url=${rescueItem.images[0]}`}
                    alt={rescueItem.title}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{rescueItem.title}</h3>
                    <p className="text-gray-500">Status: {rescueItem.status}</p>
                    <p className="text-gray-500">Rescue Status: {rescueItem.rescueStatus}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button className={`text-blue-500 hover:underline flex items-center ${rescueItem.rescueStatus === 'Rescued' ? 'hidden' : ''}`} onClick={() => markAsRescued(rescueItem._id)}>
                    <Icon icon="mdi:check-circle" className="mr-1" />
                    Mark as Rescued
                  </button>
                  <Link href={`/rescue/edit/${rescueItem._id}`} className="text-yellow-500 hover:underline flex items-center">
                    <Icon icon="mdi:pencil" className="mr-1" />
                    Edit
                  </Link>
                  <Link href={`/rescue/${rescueItem._id}`} className="text-green-500 hover:underline flex items-center">
                    <Icon icon="mdi:eye" className="mr-1" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Adoption List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Adoption List</h2>
          <div className="space-y-4">
            {myPostings.adoptionList.map((adoptionItem) => (
              <div
                key={adoptionItem._id}
                className="border border-gray-300 rounded-lg p-4 flex justify-between items-center"
              >
                <div className='flex gap-4 items-center'>
                  <Image
                    src={`https://wsrv.nl?url=${adoptionItem.images[0]}`}
                    alt={adoptionItem.title}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{adoptionItem.title}</h3>
                    <p className="text-gray-500">Adoption Status: {adoptionItem.adoptionStatus}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button className={`text-blue-500 hover:underline flex items-center ${adoptionItem.adoptionStatus === 'Adopted' ? 'hidden' : ''}`} onClick={() => markAsAdopted(adoptionItem._id)}>
                    <Icon icon="mdi:check-circle" className="mr-1" />
                    Mark as Adopted
                  </button>
                  <Link href={`/adoption/edit/${adoptionItem._id}`} className="text-yellow-500 hover:underline flex items-center">
                    <Icon icon="mdi:pencil" className="mr-1" />
                    Edit
                  </Link>
                  <Link href={`/adoption/${adoptionItem._id}`} className="text-green-500 hover:underline flex items-center">
                    <Icon icon="mdi:eye" className="mr-1" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rescue Centers */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Rescue Centers</h2>
          <div className="space-y-4">
            {myPostings.rescueCenters.map((center) => (
              <div
                key={center._id}
                className="border border-gray-300 rounded-lg p-4 flex justify-between items-center"
              >
                <div className='flex gap-4 items-center'>
                  <Image
                    src={`https://wsrv.nl?url=${center.images[0]}`}
                    alt={center.name}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{center.name}</h3>
                    <p className="text-gray-500">Location: {center.location}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Link href={`/rescue-center/edit/${center._id}`} className="text-yellow-500 hover:underline flex items-center">
                    <Icon icon="mdi:pencil" className="mr-1" />
                    Edit
                  </Link>
                  <Link href={`/rescue-center/${center._id}`} className="text-green-500 hover:underline flex items-center">
                    <Icon icon="mdi:eye" className="mr-1" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const myPostings = await axios.get(`${process.env.NEXTAUTH_URL}/api/GetMyPostings`, {
      headers: context.req ? { cookie: context.req.headers.cookie } : undefined
    });

    return {
      props: {
        myPostings: myPostings.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        myPostings: {
          rescueList: [],
          adoptionList: [],
          rescueCenters: [],
        },
      },
    };
  }
}
