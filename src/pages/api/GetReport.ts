import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";

export default async function GetReport(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await ConnectToDatabase();
    const rescueListDb = db.collection("RescueList");
    const adoptionListDb = db.collection("AdoptionList");
    const rescueCentersDb = db.collection("RescueCenters");
    const usersDb = db.collection("Users");

    const rescueList = await rescueListDb.find({}).toArray();
    const adoptionList = await adoptionListDb.find({}).toArray();
    const rescueCenters = await rescueCentersDb.find({}).toArray();
    const users = await usersDb.find({}).toArray();

    // Helper function to transform list data into { date: xx, count: xx } format
    const transformListData = (list: any[]) => {
      const dateList = list.map((item: any) => new Date(item.createdAt).toLocaleDateString());
      return dateList.reduce((acc: any, date: any) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
    };
    const rescueListDataByDate = transformListData(rescueList);
    const adoptionListDataByDate = transformListData(adoptionList);

    // get total number of rescue items and rescued items, rescueStatus = "Rescued"
    const totalRescueItems = rescueList.length;
    const totalRescuedItems = rescueList.filter((item: any) => item.rescueStatus === "Rescued").length;
    const rescueCount = {
      totalRescueItems,
      totalRescuedItems,
    };

    // get total number of adoption items and adopted items, adoptionStatus = "Adopted"
    const totalAdoptionItems = adoptionList.length;
    const totalAdoptedItems = adoptionList.filter((item: any) => item.adoptionStatus === "Adopted").length;
    const adoptionCount = {
      totalAdoptionItems,
      totalAdoptedItems,
    };

    // each rescue item has animalType, count the number of each animal type, total and rescued
    const animalTypeCount = rescueList.reduce((acc: any, item: any) => {
      acc[item.animalType] = acc[item.animalType] || { total: 0, rescued: 0 };
      acc[item.animalType].total += 1;
      if (item.rescueStatus === "Rescued") {
        acc[item.animalType].rescued += 1;
      }
      return acc;
    }, {});

    // each adoption item has animalType, count the number of each animal type, total and adopted
    const adoptionAnimalTypeCount = adoptionList.reduce((acc: any, item: any) => {
      acc[item.animalType] = acc[item.animalType] || { total: 0, adopted: 0 };
      acc[item.animalType].total += 1;
      if (item.adoptionStatus === "Adopted") {
        acc[item.animalType].adopted += 1;
      }
      return acc;
    }, {});

    // each rescue has a createdBy, count the number of rescues created by each user, get the user name from users collection
    // { userId: { name: xx, count: xx } }
    const rescueCreatedByCount = rescueList.reduce((acc: any, item: any) => {
      acc[item.createdBy] = acc[item.createdBy] || { name: "", count: 0 };
      acc[item.createdBy].count += 1;
      return acc;
    }, {});

    // each adoption has a createdBy, count the number of adoptions created by each user, get the user name from users collection
    // { userId: { name: xx, count: xx } }
    const adoptionCreatedByCount = adoptionList.reduce((acc: any, item: any) => {
      acc[item.createdBy] = acc[item.createdBy] || { name: "", count: 0 };
      acc[item.createdBy].count += 1;
      return acc;
    }, {});

    // get the user name from users collection
    for (const userId in rescueCreatedByCount) {
      console.log(userId);
      const userName = users.find((user: any) => (user._id).toString() === userId) as any;
      rescueCreatedByCount[userId].name = userName.name;
    }
    for (const userId in adoptionCreatedByCount) {
      const userName = users.find((user: any) => (user._id).toString() === userId) as any;
      adoptionCreatedByCount[userId].name = userName.name;
    }

    // get list of rescue centers with their total number members
    // { id: { name: xx, members: xx } }
    const rescueCenterMembers = rescueCenters.reduce((acc: any, center: any) => {
      acc[center._id] = { name: center.name, members: center.members.length };
      return acc;
    }, {});

    return res.status(200).json({
      rescueListDataByDate,
      adoptionListDataByDate,
      rescueCount,
      adoptionCount,
      rescueAnimalTypeCount: animalTypeCount,
      adoptionAnimalTypeCount,
      rescueCreatedByCount,
      adoptionCreatedByCount,
      rescueCenterMembers,
    });
  }
  catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}
