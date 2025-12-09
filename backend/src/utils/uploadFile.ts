import cloudinary from "@/config/cloudinary";

type UploadFileInput = {
  buffer?: Buffer;
  url?: string;
  folder: string;
  filename: string;
  resource_type?: "image" | "video" | "raw" | "auto";
};

/* Sube un archivo a Cloudinary desde Buffer o URL. */
export const uploadFile = async ({ buffer, url, folder, filename, resource_type }: UploadFileInput): Promise<{ secure_url: string }> => {
  if (!buffer && !url) {
    throw new Error("Debes proporcionar buffer o url");
  }

  if (!folder || !filename) {
    throw new Error("Folder y filename son requeridos");
  }

  // Opciones comunes para asegurar que el archivo sea público y accesible
  const uploadOptions: any = {
    folder,
    public_id: filename, // Para archivos raw, mantener el nombre completo con extensión
    resource_type: resource_type || "auto",
    access_mode: "public",
    ...(resource_type === "raw" && {
      access_mode: "public",
      invalidate: false,
    }),
  };

  if (buffer) {
    // Subida desde Buffer
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

  // Subida desde URL
  if (!url) {
    throw new Error("No se pudo obtener la URL del archivo de Telegram");
  }
  
  const result = await cloudinary.uploader.upload(url, uploadOptions);

  if (!result || !result.secure_url) {
    console.error("Error subiendo archivo desde URL a Cloudinary:", result);
    throw new Error("Error subiendo a Cloudinary desde URL");
  }

  const finalUrl = result.secure_url;

  return { secure_url: finalUrl };
};