import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex overflow-hidden relative">
      <Image
        src="/bg.png"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        width={1920}
        height={1080}
      />

      <div className="flex flex-1 items-center justify-center p-16 relative z-10">
        <div className="bg-gradient-to-br from-gray-50 to-gray-200 p-16 flex flex-col gap-6 rounded-2xl shadow-xl transition-transform duration-200 transform hover:scale-105 max-w-lg">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Lost in the void?
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The page you&apos;re looking for seems to have slipped into another
            dimension. Don&apos;t worry, we&apos;ll guide you back to safer
            ground.
          </p>
          <Link
            href="/"
            className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition flex items-center gap-2 w-max"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </div>

      <div className="w-1/2 relative items-center justify-center flex p-16 z-10 hidden md:flex">
        <Image
          src="/utils/not_found.jpg"
          alt="Not found illustration"
          width={600}
          height={600}
          style={{
            animation: "floatAnim 6s ease-in-out infinite",
          }}
          className="rounded-full shadow-xl"
        />
      </div>

      <style>{`
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
