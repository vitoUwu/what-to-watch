import { ReactNode } from "react";

interface GradientBorderProps {
  children: ReactNode
}

export function GradientBorder({ children }: GradientBorderProps) {
  return (
    <div
      className="bg-gradient-to-r from-sky-500 to-violet-700 rounded w-fit h-fit p-[2px]">
      { children }
    </div>
  )
}