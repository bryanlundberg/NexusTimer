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
  id: any;
  value: string;
  src: any;
  alt: string;
  handleClickRadio?: any;
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
        onClick={() => handleClickRadio && handleClickRadio(value)}
        className={`mx-auto cursor-pointer ${
          selectedCategory === value
            ? "outline outline-neutral-700 rounded-sm"
            : "bg-transparent"
        }`}
      >
        <Image src={src} alt={alt} />
      </label>
    </>
  );
}
