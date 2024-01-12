import { Categories } from "@/interfaces/Categories";
import Image from "next/image";

export default function CheckboxImage({
  id,
  value,
  src,
  alt,
  handleClickRadio,
  selectedCategory,
}: {
  id: string | number;
  value: string;
  src: string;
  alt: string;
  handleClickRadio?: (value: any) => void;
  selectedCategory: Categories;
}) {
  return (
    <>
      <div
        className={`mx-auto cursor-pointer w-20 h-20 sm:w-22 sm:h-22 md:w-32 md:h-32 ${
          selectedCategory === value ? "invert" : "bg-transparent"
        }`}
      >
        <input
          type="radio"
          id={`${id}`}
          name="category"
          value={value}
          className="hidden peer"
          required
        />
        <label
          htmlFor={`${id}`}
          onClick={() => handleClickRadio && handleClickRadio(value)}
        >
          <Image src={src} alt={alt} draggable={false} />
        </label>
      </div>
    </>
  );
}
