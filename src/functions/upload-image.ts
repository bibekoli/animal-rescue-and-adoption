import axios from "axios";
import FormData from "form-data";

const uploadImageToImgbb = async (name: string, image: string) => {
  const url = "https://api.imgbb.com/1/upload";

  const form = new FormData();
  form.append("image", image);
  form.append("name", name);

  const config = {
    params: {
      "key": process.env.IMGBB_API_KEY
    },
    headers: {
      ...form.getHeaders()
    }
  }

  try {
    const response = await axios.post(url, form, config);
    return {
      status: "success",
      data: response.data.data.url
    };
  }
  catch (error) {
    return {
      status: "error",
      data: "Image Upload Error"
    };
  }
};

export default uploadImageToImgbb;