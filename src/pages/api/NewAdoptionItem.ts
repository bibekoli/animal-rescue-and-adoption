import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";

export default async function NewRescueItem(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { db } = await ConnectToDatabase();
    const rescueList = db.collection("AdoptionList");
    const users = db.collection("Users");
    const email = req.body.createdBy;
    const user = await users.findOne({ email });

    const insertData = {
      ...req.body,
      createdBy: user?._id,
      createdAt: new Date(),
      adoptedAt: "",
    };
    const response = await rescueList.insertOne(insertData);
    if (response.insertedId) {
      return res.status(200).json({
        _id: response.insertedId,
      });
    } else {
      throw new Error("Failed to Add Rescue Item");
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
