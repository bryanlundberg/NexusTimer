import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh max-h-dvh flex justify-center items-center flex-col">
      <p>Could not find requested URL</p>
      <Link
        href="/"
        className="text-blue-500 hover:to-blue-700 flex gap-1 items-center"
      >
        <ArrowLeftIcon /> Return Home
      </Link>
    </div>
  );
}
