import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";

export default async function NewRescueItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await ConnectToDatabase();
    const rescueList = db.collection("RescueList");
    const response = await rescueList.find({}).toArray();
    return res.status(200).json(response);
  }
  catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
