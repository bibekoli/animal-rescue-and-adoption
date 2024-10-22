import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";
import { ObjectId } from "mongodb";

export default async function RescueCenter(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.query.id;
    const { db } = await ConnectToDatabase();
    const rescueList = db.collection("RescueCenters");
    const users = db.collection("Users");

    const response = await rescueList.findOne({
      _id: new ObjectId(id as string),
    });

    if (!response) {
      throw new Error("Rescue Center Not Found");
    }

    const user = await users.findOne({ _id: response?.createdBy });
    response.op = {
      _id: response._id,
      name: user?.name,
      userName: user?.userName,
    };

    return res.status(200).json(response);
  }
  catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}
