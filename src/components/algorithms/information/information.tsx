import * as React from "react";

interface InformationProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  title: string;
}

export default function Information({ title }: InformationProps) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  )
}
