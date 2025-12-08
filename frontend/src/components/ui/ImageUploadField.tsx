import React from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface ImageUploadFieldProps {
  imagePreview: string | null;
  isUploading: boolean;
  uploadError: string | null;
  validationError?: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onImageClick: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export default function ImageUploadField({
  imagePreview,
  isUploading,
  uploadError,
  validationError,
  fileInputRef,
  onImageClick,
  onImageChange,
  onRemoveImage,
}: ImageUploadFieldProps) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={onImageChange}
        className="hidden"
      />

      {imagePreview ? (
        <div className="relative border-2 border-purple-300 rounded-lg overflow-hidden">
          <Image
            src={imagePreview}
            alt="Preview"
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={onImageClick}
          className="border-2 border-dashed border-purple-300 rounded-lg p-8 flex flex-col items-center justify-center bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
              <p className="text-sm text-black font-medium">
                Subiendo imagen...
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center mb-3">
                <ImagePlus className="w-6 h-6 text-primary-500" />
              </div>
              <p className="text-sm text-black font-medium">
                Agregar una imagen
              </p>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-500 mt-2">{uploadError}</p>
      )}
      {validationError && (
        <p className="text-xs text-red-500 mt-2">{validationError}</p>
      )}
    </>
  );
}
