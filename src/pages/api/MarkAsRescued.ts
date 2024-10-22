import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";
import { ObjectId } from "mongodb";

export default async function UpdateRescueItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await ConnectToDatabase();
    const rescueList = db.collection("RescueList");
    const users = db.collection("Users");
    const email = req.body.createdBy;
    const user = await users.findOne({ email });

    console.log(req.body);
    

    await rescueList.updateOne(
      {
        _id: new ObjectId(req.body._id as string),
      },
      {
        $set: {
          rescueStatus: "Rescued",
          rescuedBy: new ObjectId(user?._id),
          rescuedAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      _id: req.body._id,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
