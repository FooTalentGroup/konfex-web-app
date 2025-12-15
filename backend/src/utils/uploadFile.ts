import cloudinary from "@/config/cloudinary";

type UploadFileInput = {
  buffer?: Buffer;
  url?: string;
  folder: string;
  filename: string;
  resource_type?: "image" | "video" | "raw" | "auto";
};

/* Sube un archivo a Cloudinary desde Buffer o URL. */
export const uploadFile = async ({
  buffer,
  url,
  folder,
  filename,
  resource_type,
}: UploadFileInput): Promise<{ secure_url: string }> => {
  if (!buffer && !url) {
    throw new Error("Debes proporcionar buffer o url");
  }

  if (!folder || !filename) {
    throw new Error("Folder y filename son requeridos");
  }

  const uploadOptions: any = {
    folder,
    public_id: filename,
    resource_type: resource_type || "auto",
    access_mode: "public",
    ...(resource_type === "raw" && {
      access_mode: "public",
      invalidate: false,
    }),
  };

  if (buffer) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: unknown, result: any) => {
          if (error) {
            return reject(error);
          }
          if (!result || !result.secure_url) {
            return reject(new Error("Error subiendo a Cloudinary"));
          }

          const finalUrl = result.secure_url;

          resolve({ secure_url: finalUrl });
        }
      );
      stream.end(buffer);
    });
  }

  if (!url) {
    throw new Error("No se pudo obtener la URL del archivo de Telegram");
  }

  const result = await cloudinary.uploader.upload(url, uploadOptions);

  if (!result || !result.secure_url) {
    throw new Error("Error subiendo a Cloudinary desde URL");
  }

  const finalUrl = result.secure_url;

  return { secure_url: finalUrl };
};
