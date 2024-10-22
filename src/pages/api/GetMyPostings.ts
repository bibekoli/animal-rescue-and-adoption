import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";
import { getToken } from "next-auth/jwt";

export default async function GetMyPostings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await ConnectToDatabase();
    const rescueListDb = db.collection("RescueList");
    const adoptionListDb = db.collection("AdoptionList");
    const rescueCentersDb = db.collection("RescueCenters");
    const usersDb = db.collection("Users");

    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const email = token.email;
    const user = await usersDb.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }

    const rescueList = await rescueListDb.find({
      createdBy: user._id,
    }).toArray();
    const adoptionList = await adoptionListDb.find({
      createdBy: user._id,
    }).toArray();
    const rescueCenters = await rescueCentersDb.find({
      createdBy: user._id,
    }).toArray();

    return res.status(200).json({
      rescueList,
      adoptionList,
      rescueCenters,
    });
  }
  catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}
