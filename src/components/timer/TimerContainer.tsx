interface TimerContainer {
  children: React.ReactNode;
}
export default function TimerContainer({ children }: TimerContainer) {
  return (
    <>
      <div className="flex flex-col justify-between px-5 py-3 grow">
        {children}
      </div>
    </>
  );
}
