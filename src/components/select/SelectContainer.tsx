import { useRef } from "react";
import useClickOutside from "@/hooks/useClickOutside";

interface SelectContainer {
  handleClickOutside: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SelectContainer({
  handleClickOutside,
  children,
  className,
}: SelectContainer) {
  const componentRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(componentRef, handleClickOutside);
  return (
    <>
      <div className={`relative ${className}`} ref={componentRef}>
        {children}
      </div>
    </>
  );
}
