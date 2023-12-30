interface TimerContainer {
  children: React.ReactNode;
}
export default function TimerContainer({ children }: TimerContainer) {
  return (
    <>
      <div className="flex flex-col justify-between px-2 pt-2 sm:px-3 grow">
        {children}
      </div>
    </>
  );
}
