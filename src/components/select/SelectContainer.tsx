import { useRef } from "react";
import useClickOutside from "@/hooks/useClickOutside";

interface SelectContainer {
  handleClickOutside: () => void;
  children: React.ReactNode;
}

export function SelectContainer({
  handleClickOutside,
  children,
}: SelectContainer) {
  const componentRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(componentRef, handleClickOutside);
  return (
    <>
      <div className="relative" ref={componentRef}>
        {children}
      </div>
    </>
  );
}
