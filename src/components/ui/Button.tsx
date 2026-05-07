'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:from-purple-500 hover:to-purple-400',
        secondary:
          'bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200 shadow-sm hover:bg-white hover:shadow-md',
        ghost:
          'text-gray-600 hover:bg-purple-50 hover:text-purple-600',
        outline:
          'border border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        glass:
          'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-6 text-base',
        xl: 'h-14 rounded-2xl px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
