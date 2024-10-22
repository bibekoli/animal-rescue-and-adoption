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
  }
  catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}
