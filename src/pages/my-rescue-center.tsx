import axios from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import Swal from 'sweetalert2';
import { TableRow } from './rescue-center/[id]';
import ImageCarousel from '@/components/ImageCarousel';
import Link from 'next/link';
import { haversineDistance } from '@/functions/haversineDistance';

export default function MyRC({ myRC }: { myRC: (RescueCenter & { membersList: User[] })[] }) {
  const [email, setEmail] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [myLocation, setMyLocation] = useState<any>(null);

  const handleAddMember = async () => {
    try {
      const response = await axios.post('/api/AddMember', { email });
      Swal.fire('Success', 'Member added successfully!', 'success');
      setEmail('');
      window.location.reload();
    }
    catch (error: any) {
      console.error('Error adding member:', error);
      Swal.fire('Error', error.response.data.message, 'error');
    }
  };

  return (
    <>
      <Head>
        <title>My Rescue Center</title>
      </Head>
      <div className="">
        {myRC.length === 0 && (
          <div className="text-center text-2xl font-semibold mt-4">
            You have not created any rescue centers yet.
          </div>
        )}

        {myRC.length > 0 ? (
          myRC.map((center, index) => (
            <div key={center._id} className="mb-8">
              <h2 className="text-2xl font-semibold mt-6 mb-4">{center.name}</h2>
              <div className="flex flex-col md:flex-row">
                <div className={`flex flex-col md:w-1/2 m-4 relative rounded-xl`}>
                  <ImageCarousel
                    images={myRC[0].images}
                    activeImageIndex={activeImageIndex}
                    setActiveImageIndex={setActiveImageIndex}
                  />
                </div>
                <div className="flex flex-col md:w-1/2">
                  <h1 className={`text-2xl font-[800] flex items-center gap-2`}>
                    {center.name}
                  </h1>

                  <table className="w-full border mt-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2">Attribute</th>
                        <th className="p-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <TableRow label="Name" value={center.name} />
                      <TableRow label="Contact" value={center.contactNumber} />
                      <TableRow label="Location" value={center.location} />
                      <TableRow label="Landmark" value={center.landmark} />
                      {/* Add distance calculation if available */}
                    </tbody>
                  </table>

                  <div className="flex flex-col gap-4 mt-4">
                    <div>
                      <span className={`font-bold`}>Description: </span>
                      <br />
                      <span className={`font-[500] text-gray-600`}>
                        {center.description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mt-6 mb-4">Members</h3>
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {center.membersList.map((member) => (
                    <tr key={member._id}>
                      <td className="p-2 text-center">{member.name}</td>
                      <td className="p-2 text-center">{member.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="text-2xl font-semibold mt-6 mb-4">Add New Member</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md"
                />
                <button
                  onClick={handleAddMember}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add Member
                </button>
              </div>
              <hr className="my-8" />
            </div>
          ))
        ) : (
          <p>No Rescue Centers available</p>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const myPostings = await axios.get(`${process.env.NEXTAUTH_URL}/api/GetMyRC`, {
      headers: context.req ? { cookie: context.req.headers.cookie } : undefined,
    });

    return {
      props: {
        myRC: myPostings.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        myRC: {
          name: '',
          description: '',
          contactNumber: '',
          location: '',
          landmark: '',
          membersList: [],
        },
      },
    };
  }
}
