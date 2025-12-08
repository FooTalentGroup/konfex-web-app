import { type UploadApiOptions, type UploadApiResponse, v2 as cloudinary } from "cloudinary";

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
        (error: unknown, result: UploadApiResponse | undefined) => {
          if (error) {
            logger.error({ error }, "Error subiendo archivo a Cloudinary");
            return reject(error instanceof Error ? error : new Error("Unknown error"));
          }
          if (!result?.secure_url) {
            logger.error({ result }, "Cloudinary no devolvió secure_url");
            return reject(new Error("Error subiendo a Cloudinary"));
          }

          const finalUrl = result.secure_url;

          if (resource_type === "raw") {
            logger.info(
              {
                url: finalUrl,
                public_id: result.public_id,
                resource_type: result.resource_type,
                format: result.format,
              },
              "PDF subido a Cloudinary"
            );
          }

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

  if (resource_type === "raw") {
    logger.info(
      {
        url: finalUrl,
        public_id: result.public_id,
        resource_type: result.resource_type,
        format: result.format,
      },
      "Archivo raw subido a Cloudinary desde URL"
    );
  }

  return { secure_url: finalUrl };
};
