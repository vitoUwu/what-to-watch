import { Slot } from '@radix-ui/react-slot'
import { ReactNode } from 'react'
import { GradientBorder } from './GradientBorder'

interface ButtonProps {
  children: ReactNode
  asChild?: boolean
  onClick: () => void
}

export function Button({ children, asChild, onClick }: ButtonProps) {
  const Component = asChild ? Slot : 'button'

  return (
    <GradientBorder>
      <Component onClick={onClick} className='outline-none ring-2 focus:ring-zinc-200 rounded px-4 py-1 bg-zinc-900 hover:bg-gradient-to-r from-sky-500 to-violet-700 active:from-sky-700 active:to-violet-900'>
        {children}
      </Component>
    </GradientBorder>
  )
}