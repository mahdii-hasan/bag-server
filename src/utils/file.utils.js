import { uploadToCloudinary } from "../modules/fileUpload/fileUpload.service";

export const uploadMultipleFiles = async (files, folder) => {
  return Promise.all(
    files.map((file) => uploadToCloudinary(file, folder))
  );
};