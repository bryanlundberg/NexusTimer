import { ChangeEvent, useRef } from "react";
import { Button } from "../button";
import { useBackgroundImageStore } from "@/store/BackgroundThemeStore";

export default function CustomTheme() {
  const dataInputRef = useRef<HTMLInputElement>(null);
  const { setBackgroundImage } = useBackgroundImageStore();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newBackgroundImage = event.target.files?.[0];

    if (!newBackgroundImage) return;

    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedImageTypes.includes(newBackgroundImage.type)) {
      alert("Only image files (JPEG, PNG, GIF) are allowed.");
      if (dataInputRef.current) {
        dataInputRef.current.value = "";
      }
      return;
    }

    // Convert image to string base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target?.result as string;

      // Save to localstorage
      localStorage.setItem("customBackgroundImage", base64Image);
      setBackgroundImage(base64Image);
    };

    reader.readAsDataURL(newBackgroundImage);
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
        className="ms-9 mt-3"
        label="Custom background image"
        minimalistic={false}
        onClick={() => dataInputRef.current && dataInputRef.current.click()}
      />
    </>
  );
}
