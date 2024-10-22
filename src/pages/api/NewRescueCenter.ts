import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";

export default async function NewRescueItem(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { db } = await ConnectToDatabase();
    const rescueCenters = db.collection("RescueCenters");
    const users = db.collection("Users");
    const email = req.body.createdBy;
    const user = await users.findOne({ email });

    const insertData = {
      ...req.body,
      createdAt: new Date(),
      members: [user?._id],
      createdBy: user?._id,
    };
    const response = await rescueCenters.insertOne(insertData);
    if (response.insertedId) {
      return res.status(200).json({
        _id: response.insertedId,
      });
    } else {
      throw new Error("Failed to Add Rescue Center");
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
