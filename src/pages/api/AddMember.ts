import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";
import { getToken } from "next-auth/jwt";

export default async function AddMember(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await ConnectToDatabase();
    const rescueCenter = db.collection("RescueCenters");
    const users = db.collection("Users");

    const email = req.body.email;
    console.log(email);

    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const myemail = token.email;
    const meuser = await users.findOne({ email: myemail });


    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const myRescueCenter = await rescueCenter.findOne({
      members: meuser?._id,
    });

    if (!myRescueCenter) {
      return res.status(404).json({
        message: "Rescue Center not found",
      });
    }

    // if user id already exists in the members array, throw an error
    if (myRescueCenter.members.includes(user._id)) {
      return res.status(400).json({
        message: "User already exists in the rescue center",
      });
    }

    await rescueCenter.updateOne(
      { _id: myRescueCenter._id },
      { $push: { members: user._id } as any }
    );

    return res.status(200).json({
      message: "Member added successfully",
    });
  }
  catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}
