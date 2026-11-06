import type { ButtonHTMLAttributes, ReactNode } from 'react'

import './DangerButton.css'

export type DangerButtonVariant = 'Primary' | 'Subtle'
export type DangerButtonSize = 'Medium' | 'Small'

export interface DangerButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: DangerButtonVariant
  size?: DangerButtonSize
  children?: ReactNode
  label?: ReactNode
  startIcon?: ReactNode
  endIcon?: ReactNode
}

export function DangerButton({
  variant = 'Primary',
  size = 'Medium',
  children,
  label,
  startIcon,
  endIcon,
  className,
  type = 'button',
  ...buttonProps
}: DangerButtonProps) {
  const classes = [
    'tgg-danger-button',
    `tgg-danger-button--${variant.toLowerCase()}`,
    `tgg-danger-button--${size.toLowerCase()}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button {...buttonProps} type={type} className={classes}>
      {startIcon != null && (
        <span className="tgg-danger-button__icon" aria-hidden="true">
          {startIcon}
        </span>
      )}
      <span className="tgg-danger-button__label">{children ?? label}</span>
      {endIcon != null && (
        <span className="tgg-danger-button__icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  )
}
