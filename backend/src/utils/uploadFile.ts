import cloudinary from "@/config/cloudinary";

export const uploadFile = async (buffer: Buffer, folder: string, filename: string) => {
  const result = await cloudinary.uploader.upload_stream(
    { folder, public_id: filename },
    (error, result) => {
      if (error) throw error;
      return result;
    }
  );

  // Como upload_stream usa callback, envuelve en Promise
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as any);
      }
    );
    stream.end(buffer);
  });
};
