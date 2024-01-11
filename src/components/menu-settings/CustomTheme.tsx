import { ChangeEvent, useRef } from "react";
import { Button } from "../button";
import { useBackgroundImageStore } from "@/store/BackgroundThemeStore";
import ImageIcon from "@/icons/ImageIcon";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";

export default function CustomTheme() {
  const dataInputRef = useRef<HTMLInputElement>(null);
  const { setBackgroundImage } = useBackgroundImageStore();
  const { lang } = useSettingsModalStore();
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newBackgroundImage = event.target.files?.[0];

    if (!newBackgroundImage) return;

    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSizeInBytes = 4.5 * 1024 * 1024; // 4.5MB

    if (!allowedImageTypes.includes(newBackgroundImage.type)) {
      alert(`${translation.settings["allowed-file-types"][lang]}`);
      if (dataInputRef.current) {
        dataInputRef.current.value = "";
      }
      return;
    }

    if (newBackgroundImage.size > maxSizeInBytes) {
      alert(`${translation.settings["max-file-size"][lang]} 4.5 Mb`);
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
      <input
        type="file"
        accept="image/*"
        ref={dataInputRef}
        className="hidden"
        onChange={handleImageChange}
      />
      <Button
        className="ms-9 mt-3 font-normal"
        label={translation.settings["custom-background-image"][lang]}
        minimalistic={false}
        onClick={() => dataInputRef.current && dataInputRef.current.click()}
        icon={<ImageIcon />}
      />
      <div className="block ms-9 text-xs align-bottom">
        {translation.settings["format"][lang]} .png .jpg .gif
      </div>
    </>
  );
}
