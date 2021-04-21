import axios from "axios";
import FormData from "form-data";

async function uploadImages(req, res, next) {
  try {
    let files = req.files.photos;
    files = Array.from(Array.isArray(files) ? files : [files]);
    const result = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("smfile", Buffer.from(file.data), {
        filename: file.name,
      });
      const header = formData.getHeaders();
      header.Authorization = process.env.SMMS_TOKEN;
      await axios
        .post(`${process.env.SMMS_URI}/upload`, formData, {
          headers: header,
        })
        .then((response) => {
          if (response.data.success) {
            result.push(response.data.data.url);
          } else {
            result.push(response.data.images);
          }
        })
        .catch(() => console.error("Failure"));
    }

    console.log(result);
  } catch (err) {
    console.log(err);
    return res.status(err.status || 500).json({ message: err.message });
  }

  return next();
}

export { uploadImages };
