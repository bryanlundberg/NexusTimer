import CubeIcon from "@/icons/Cube";
import Link from "next/link";

export default function EmptySolves({ message }: { message: string }) {
  return (
    <>
      <Link
        href="/"
        className="gap-3 justify-center items-center w-full border rounded-md border-zinc-800 h-96 border-dashed flex flex-col"
      >
        <CubeIcon />
        <div>{message}</div>
      </Link>
    </>
  );
}
