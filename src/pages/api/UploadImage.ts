import { NextApiRequest, NextApiResponse } from "next";
import uploadImageToImgbb from "@/functions/upload-image";

export default async function UploadImage(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = JSON.parse(req.body);
  const result = await uploadImageToImgbb((+new Date()).toString(), body.image);
  if (result.status === "success") {
    return res.status(200).json({
      image: result.data
    });
  }
  else {
    return res.status(500).json({
      message: "Failed To Upload Image"
    });
  }
}
