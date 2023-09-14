import { Categories } from "@/interfaces/Categories";
import Image from "next/image";
import { useState } from "react";

export default function CheckboxImage({
  id,
  value,
  src,
  alt,
  handleClickRadio,
  selectedCategory,
}: {
  id: any;
  value: string;
  src: any;
  alt: string;
  handleClickRadio: any;
  selectedCategory: Categories;
}) {
  return (
    <>
      <input
        type="radio"
        id={id}
        name="category"
        value={value}
        className="hidden peer"
        required
      />
      <label
        htmlFor={id}
        onClick={() => handleClickRadio(value)}
        className={`cursor-pointer ${
          selectedCategory === value
            ? "outline-dashed outline-amber-300 rounded-sm"
            : "bg-transparent border-0"
        }`}
      >
        <Image src={src} alt={alt} />
      </label>
    </>
  );
}
