import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,

  BarElement,
} from "chart.js";
import Link from "next/link";

// Register the required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const LineChart = ({ chartData, chartTitle, label }: any) => {
  const dates = Object.keys(chartData).sort();
  const dataValues = dates.map((date) => chartData[date]);

  const data = {
    labels: dates,
    datasets: [
      {
        label: label,
        data: dataValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: chartTitle,
      },
    },
  };

  // @ts-expect-error
  return <Line data={data} options={options} />;
};

const BarChart = ({ chartData, chartTitle, labels }: any) => {
  const data = {
    labels: labels, // Labels for categories (e.g., total and processed items)
    datasets: [
      {
        label: chartTitle,
        data: chartData, // Data values for each category
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: chartTitle,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // @ts-expect-error
  return <Bar data={data} options={options} />;
};


export default function Reports({ data }: any) {

  console.log(data);
  
  return (
    <>
      <Head>
        <title>Report</title>
      </Head>
      <h1 className="text-2xl font-bold text-black pb-6">Reports</h1>
      <h2 className="text-xl font-bold text-black pb-6">Listing of Rescues and Adoptions By Date</h2>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2 p-2">
          <LineChart
            chartData={data.rescueListDataByDate}
            chartTitle="Rescue List"
            label="Rescue List"
          />
        </div>
        <div className="w-full lg:w-1/2 p-2">
          <LineChart
            chartData={data.adoptionListDataByDate}
            chartTitle="Adoption List"
            label="Adoption List"
          />
        </div>
      </div>
      <br />
      <br />
      <br />
      <h2 className="text-xl font-bold text-black pb-6">Total Number of Rescues and Adoptions</h2>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2 p-2">
          <BarChart
            chartData={[data.rescueCount.totalRescueItems, data.rescueCount.totalRescuedItems]}
            chartTitle="Rescue List"
            labels={["Total Rescue Items", "Total Rescued Items"]}
          />
        </div>
        <div className="w-full lg:w-1/2 p-2">
          <BarChart
            chartData={[data.adoptionCount.totalAdoptionItems, data.adoptionCount.totalAdoptedItems]}
            chartTitle="Adoption List"
            labels={["Total Adoption Items", "Total Adopted Items"]}
          />
        </div>
      </div>
      <br />
      <br />
      <br />
      {/* show the data in table */}
      <h2 className="text-xl font-bold text-black pb-6">Total Number of Rescues and Adoptions By Animal Type</h2>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2 p-2">
          <BarChart
            chartData={Object.keys(data.rescueAnimalTypeCount).map((key) => data.rescueAnimalTypeCount[key].total)}
            chartTitle="Rescue List"
            labels={Object.keys(data.rescueAnimalTypeCount)}
          />
        </div>
        <div className="w-full lg:w-1/2 p-2">
          <BarChart
            chartData={Object.keys(data.adoptionAnimalTypeCount).map((key) => data.adoptionAnimalTypeCount[key].total)}
            chartTitle="Adoption List"
            labels={Object.keys(data.adoptionAnimalTypeCount)}
          />
        </div>
      </div>
      <br />
      <br />
      <br />
      <h2 className="text-xl font-bold text-black pb-6">Total Number of Rescues and Adoptions By User</h2>
      <div className="flex flex-wrap">
        <div className="w-full p-2">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">User</th>
                <th className="border px-4 py-2 text-left">Total Rescue Listed</th>
                <th className="border px-4 py-2 text-left">View Listed Items</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data.rescueCreatedByCount).map((key) => (
                <tr key={key}>
                  <td className="border px-4 py-2 text-left">{data.rescueCreatedByCount[key].name}</td>
                  <td className="border px-4 py-2 text-left">{data.rescueCreatedByCount[key].count}</td>
                  <td className="border px-4 py-2 text-left">
                    <a href={`/profile/${key}`} className="text-blue-500 hover:underline">View Posts</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full p-2">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">User</th>
                <th className="border px-4 py-2 text-left">Total Adoptions Listed</th>
                <th className="border px-4 py-2 text-left">View Posts Listed</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data.adoptionCreatedByCount).map((key) => (
                <tr key={key}>
                  <td className="border px-4 py-2 text-left">{data.adoptionCreatedByCount[key].name}</td>
                  <td className="border px-4 py-2 text-left">{data.adoptionCreatedByCount[key].count}</td>
                  <td className="border px-4 py-2 text-left">
                    <a href={`/profile/${key}`} className="text-blue-500 hover:underline">View Posts</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <br />
      <br />
      {/* "rescueCenterMembers": {
        "Lanai Rescue Center": 3,
        "Jaugar Rescue Center": 1,
        "Chitwan National Park RC": 2
    } */}
      <h2 className="text-xl font-bold text-black pb-6">Total Number of Rescues and Adoptions By Rescue Center</h2>
      <div className="flex flex-wrap">
        <div className="w-full p-2">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">S.N.</th>
                <th className="border px-4 py-2 text-left">Rescue Center</th>
                <th className="border px-4 py-2 text-left">Total Members</th>
                <th className="border px-4 py-2 text-left">View Details</th>
              </tr>
            </thead>
            <tbody>
            {/* "rescueCenterMembers": {
        "671389084b4122a6690885a4": {
            "name": "Lanai Rescue Center",
            "members": 3
        },
        "6713895c4b4122a6690885a5": {
            "name": "Jaugar Rescue Center",
            "members": 1
        },
        "6718ca15507c3a6ad10fde5f": {
            "name": "Chitwan National Park RC",
            "members": 2
        }
    } */}
              {Object.keys(data.rescueCenterMembers).map((key, index) => (
                <tr key={key}>
                  <td className="border px-4 py-2 text-left">{index + 1}</td>
                  <td className="border px-4 py-2 text-left">{data.rescueCenterMembers[key].name}</td>
                  <td className="border px-4 py-2 text-left">{data.rescueCenterMembers[key].members}</td>
                  <td className="border px-4 py-2 text-left">
                    <Link href={`/rescue-center/${key}`} className="text-blue-500 hover:underline">View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const rescueLists = await axios.get(`${process.env.NEXTAUTH_URL}/api/GetReport`);
    return {
      props: {
        data: rescueLists.data,
      },
    };
  }
  catch (error) {
    console.log(error);
    return {
      props: {
        data: [],
      }
    };
  }
}