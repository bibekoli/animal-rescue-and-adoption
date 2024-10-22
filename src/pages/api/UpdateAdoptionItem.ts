import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";
import { ObjectId } from "mongodb";

export default async function UpdateAdoptionItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await ConnectToDatabase();
    const adoptionList = db.collection("AdoptionList");
    const users = db.collection("Users");
    const email = req.body.createdBy;
    const user = await users.findOne({ email });

    const updateData = {
      ...req.body
    };
    delete updateData._id;
    delete updateData.createdBy;

    await adoptionList.updateOne(
      {
        _id: new ObjectId(req.body._id as string),
      },
      {
        $set: updateData,
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
