import { Slot } from "@radix-ui/react-slot";
import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode
  asChild?: boolean
  className?: string
}

export function GradientText({ children, asChild, className }: GradientTextProps) {
  const Component = asChild ? Slot : "span"

  return (
    <Component className={`inline-block bg-gradient-to-r from-sky-500 to-violet-700 bg-clip-text text-transparent ${className}`}>
      { children }
    </Component>
  )
}