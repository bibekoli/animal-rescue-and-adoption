import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDatabase from "@/functions/mongodb";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";

export default async function GetMyRescueCenter(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await ConnectToDatabase();
    const rescueCenter = db.collection("RescueCenters");
    const users = db.collection("Users");
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const email = token.email;
    const user = await users.findOne({ email });

    const myRescueCenter = await rescueCenter.find({
      members: user?._id,
    }).toArray();

    console.log(myRescueCenter);
    

    if (!myRescueCenter) {
      return res.status(404).json({
        message: "Rescue Center not found",
      });
    }

    // const members = await users.find(
    //   { _id: { $in: myRescueCenter.members } },
    //   { projection: { name: 1, email: 1 } }
    // ).toArray();

    // myRescueCenter.membersList = members;

    // loop through the members array and get the details of each member
    // [
    //   {
    //     _id: new ObjectId('671389084b4122a6690885a4'),
    //     name: 'Lanai Rescue Center',
    //     description: 'Working in animal rescue since 2000',
    //     contactNumber: '9843555676',
    //     location: 'Birtamod Municipality, Jhapa, Koshi Province',
    //     locationPosition: { lat: 26.64316263704834, lng: 87.99233436584473 },
    //     landmark: 'B eside the temple',
    //     images: [ 'https://i.ibb.co/HDWW01j/1729332962517.jpg' ],
    //     createdBy: new ObjectId('671374284b4122a6690885a1'),
    //     createdAt: 2024-10-19T10:25:12.076Z,
    //     members: [
    //       new ObjectId('671374284b4122a6690885a1'),
    //       new ObjectId('671374284b4122a6690885a1'),
    //       new ObjectId('6717cb344f2f25b91fb64d60')
    //     ]
    //   },
    //   {
    //     _id: new ObjectId('6713895c4b4122a6690885a5'),
    //     name: 'Jaugar Rescue Center',
    //     description: 'working for the welfare of jaugars and all animals since 1900',
    //     contactNumber: '023657786',
    //     location: 'Kamal-03, Kerkha Bazar, Kamal, Jhapa, Koshi Province, Nepal',
    //     locationPosition: { lat: 26.646844988896188, lng: 87.76840209960939 },
    //     landmark: '100 Meters West of the bridge',
    //     images: [ 'https://i.ibb.co/nM3HTW3/1729333352620.jpg' ],
    //     createdBy: 'abibekoli@gmail.com',
    //     createdAt: 2024-10-19T10:26:36.687Z,
    //     members: [ new ObjectId('671374284b4122a6690885a1') ]
    //   }
    // ]

    const finalRC = [];
    
    for (let i = 0; i < myRescueCenter.length; i++) {
      const members = await users.find(
        { _id: { $in: myRescueCenter[i].members } },
        { projection: { name: 1, email: 1 } }
      ).toArray();

      myRescueCenter[i].membersList = members;
      finalRC.push(myRescueCenter[i]);
    }

    return res.status(200).json(finalRC);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
