import { ChangeEvent, useRef } from "react";
import { useBackgroundImageStore } from "@/store/BackgroundThemeStore";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { ImageIcon } from "@radix-ui/react-icons";

export default function CustomTheme() {
  const dataInputRef = useRef<HTMLInputElement>(null);
  const { setBackgroundImage } = useBackgroundImageStore();
  const t = useTranslations("Index.Settings-menu");
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newBackgroundImage = event.target.files?.[0];

    if (!newBackgroundImage) return;

    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSizeInBytes = 4 * 1024 * 1024; // 4MB

    if (!allowedImageTypes.includes(newBackgroundImage.type)) {
      alert(`${t("allowed-file-types")}`);
      if (dataInputRef.current) {
        dataInputRef.current.value = "";
      }
      return;
    }

    if (newBackgroundImage.size > maxSizeInBytes) {
      alert(`${t("max-file-size")} 4 Mb`);
      if (dataInputRef.current) {
        dataInputRef.current.value = "";
      }
      return;
    }

    // Convert image to string base64
    const base64Image = await readFileAsBase64(newBackgroundImage);

    // Save to local storage
    localStorage.setItem("customBackgroundImage", base64Image);
    setBackgroundImage(base64Image);
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        resolve(base64Image);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <div className="ps-3">
        <input
          type="file"
          accept="image/*"
          ref={dataInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
        <Button
          variant={"outline"}
          className="mt-3 flex items-center gap-1"
          onClick={() => dataInputRef.current && dataInputRef.current.click()}
        >
          <ImageIcon className="w-4 h-4" />
          {t("custom-background-image")}
        </Button>
        <div className="block text-xs align-bottom mt-1">
          {t("format")} .png .jpg .gif
        </div>
      </div>
    </>
  );
}
