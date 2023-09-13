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
          selectedCategory === value ? "bg-orange-500" : "bg-transparent"
        }`}
      >
        <Image src={src} alt={alt} />
      </label>
    </>
  );
}
