import { type UploadApiOptions, v2 as cloudinary } from "cloudinary";

import logger from "./logger";

type UploadFileInput = {
  buffer?: Buffer;
  url?: string;
  folder: string;
  filename: string;
  resource_type?: "image" | "video" | "raw" | "auto";
};

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

  const uploadOptions: UploadApiOptions = {
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
            console.error("Error subiendo archivo a Cloudinary:", error);
            return reject(error);
          }
          if (!result || !result.secure_url) {
            console.error("Cloudinary no devolvió secure_url:", result);
            return reject(new Error("Error subiendo a Cloudinary"));
          }

          // Para archivos raw, la URL debería ser directamente accesible
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

  if (!result?.secure_url) {
    logger.error({ result }, "Cloudinary no devolvió secure_url desde URL");
    throw new Error("Error subiendo a Cloudinary");
  }

  const finalUrl = result.secure_url;

  return { secure_url: finalUrl };
};
