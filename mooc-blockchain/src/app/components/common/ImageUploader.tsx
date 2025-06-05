import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRef, useState } from "react";

const ImageUploader = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  return (
    <Card
      className="border-dashed border-2 border-gray-300 w-full max-w-100 h-70 flex items-center justify-center flex-col text-center cursor-pointer transition hover:border-gray-500 overflow-hidden"
      onClick={handleCardClick}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Preview"
          className="h-fit w-full object-cover"
        />
      ) : (
        <p className="text-lg font-medium">Đổi ảnh ở đây</p>
      )}
    </Card>
  );
};

export default ImageUploader;
