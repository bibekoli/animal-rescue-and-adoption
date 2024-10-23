import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";
import { ObjectId } from "mongodb";

export default async function GetUserPostings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await ConnectToDatabase();
    const rescueListDb = db.collection("RescueList");
    const adoptionListDb = db.collection("AdoptionList");
    const rescueCentersDb = db.collection("RescueCenters");
    const usersDb = db.collection("Users");

    const userId = req.body.userId as string;

    const rescueList = await rescueListDb.find({
      createdBy: new ObjectId(userId),
    }).toArray();
    const adoptionList = await adoptionListDb.find({
      createdBy: new ObjectId(userId),
    }).toArray();
    const rescueCenters = await rescueCentersDb.find({
      createdBy: new ObjectId(userId),
    }).toArray();
    const user = await usersDb.findOne({ _id: new ObjectId(userId) });

    return res.status(200).json({
      rescueList,
      adoptionList,
      rescueCenters,
      user,
    });
  }
  catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}
