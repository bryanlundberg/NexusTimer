import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Link href={"./help/privacy-policy"}>
        <Button>Privacy Policy</Button>
      </Link>
    </>
  );
}
