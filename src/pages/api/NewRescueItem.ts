import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";
import { haversineDistance } from "@/functions/haversineDistance";
import Email from "@/functions/email";

export const MAX_DISTANCE = 10;
export default async function NewRescueItem(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { db } = await ConnectToDatabase();
    const rescueList = db.collection("RescueList");
    const rescueCentersDb = db.collection("RescueCenters");
    const users = db.collection("Users");
    const email = req.body.createdBy;
    const user = await users.findOne({ email });

    console.log(req.body.locationPosition);
    const memberIds = [];
    
    const rescueCenters = await rescueCentersDb.find({}).toArray();
    for (let i = 0; i < rescueCenters.length; i++) {
      const center = rescueCenters[i];
      const requestLocation = req.body.locationPosition;
      const centerLocation = center.locationPosition;

      const distance = haversineDistance(requestLocation, centerLocation);
      if (distance <= MAX_DISTANCE) {
        memberIds.push(center.members);
      }
    }
    const memberEmails = [] as string[];
    const memberIdsFlat = memberIds.flat();
    // find all members with the memberIds
    for (let i = 0; i < memberIdsFlat.length; i++) {
      const member = await users.findOne({ _id: memberIdsFlat[i] });
      memberEmails.push(member?.email);
    }

    console.log(memberEmails);
    // remove duplicates
    // @ts-expect-error - uniqueMemberEmails is a new Set
    const uniqueMemberEmails = [...new Set(memberEmails)];

    const insertData = {
      ...req.body,
      rescueStatus: "Pending",
      rescuedBy: "",
      rescuedAt: "",
      createdBy: user?._id,
      createdAt: new Date(),
    };
    const response = await rescueList.insertOne(insertData);

    uniqueMemberEmails.forEach((email) => {
      Email.SendRescueEmail(
        email,
        req.body.title,
        req.body.location,
        req.body.description,
        response.insertedId.toString(),
      );
    });
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
