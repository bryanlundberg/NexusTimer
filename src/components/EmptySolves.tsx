import CubeIcon from "@/icons/Cube";
import Link from "next/link";

export default function EmptySolves({ message }: { message: string }) {
  return (
    <>
      <Link
        href="/"
        className="m-3 grow gap-3 justify-center items-center border rounded-md border-zinc-600 border-dashed flex flex-col"
      >
        <CubeIcon />
        <div>{message}</div>
      </Link>
    </>
  );
}
