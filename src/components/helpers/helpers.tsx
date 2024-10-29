export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-bold mb-5 mt-8">{children}</h2>;
}

export function Para({ children }: { children: React.ReactNode }) {
  return <p className="mb-3">{children}</p>;
}

export function Li({ children }: { children: React.ReactNode }) {
  return <li className="mb-2">{children}</li>;
}
