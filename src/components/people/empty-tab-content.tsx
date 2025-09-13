import Image from 'next/image';

export default function EmptyTabContent() {
  return (
    <div
      className="relative flex flex-col items-center justify-center h-96 bg-sidebar rounded-lg shadow-md overflow-hidden"
    >
      <Image
        src="/bg.png"
        alt="Background Image"
        className="absolute inset-0 object-cover w-full h-full"
        width={1920}
        height={1080}
        draggable={false}
        quality={50}
        style={{
          zIndex: 0,
          opacity: 0.1
        }}
      ></Image>
      <div className="relative scroll-m-20 text-xl tracking-tight max-w-40 mx-auto text-center">
        No content available for this tab.
      </div>
    </div>
  );
}
