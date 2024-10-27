export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-y-auto">
      <div className="max-w-md mx-auto bg-background/90 backdrop-blur-lg pt-2">
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}
