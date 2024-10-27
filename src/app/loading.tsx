import Loading from "@/components/Loading";

export default function Page() {
  return (
    <>
      <div className="min-h-dvh max-h-dvh w-full overflow-hidden flex items-center justify-center bg-background">
        <Loading />
      </div>
    </>
  );
}
