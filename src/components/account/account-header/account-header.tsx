import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface AccountHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  back: string;
  className?: string;
}

export default function AccountHeader({
  label,
  back,
  className,
  ...rest
}: AccountHeaderProps) {
  const router = useRouter();
  return (
    <>
      <div className={cn("relative", className)} {...rest}>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute top-0 left-0"
          onClick={() => router.push(back)}
        >
          <ArrowLeftIcon className="size-6 " />
        </Button>
        <div className="text-2xl font-black text-center mb-5">{label}</div>
      </div>
    </>
  );
}
