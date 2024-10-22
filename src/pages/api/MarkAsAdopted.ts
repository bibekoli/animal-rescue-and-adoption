import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";
import { ObjectId } from "mongodb";

export default async function UpdateAdoptionItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await ConnectToDatabase();
    const adoptionList = db.collection("AdoptionList");

    await adoptionList.updateOne(
      {
        _id: new ObjectId(req.body._id as string),
      },
      {
        $set: {
          adoptionStatus: "Adopted",
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
