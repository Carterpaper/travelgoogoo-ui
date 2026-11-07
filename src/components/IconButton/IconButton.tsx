import type { ButtonHTMLAttributes, ReactNode } from 'react'

import './IconButton.css'

export type IconButtonVariant = 'Primary' | 'Neutral' | 'Subtle'
export type IconButtonSize = 'Medium' | 'Small'

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  icon: ReactNode
  'aria-label': string
}

export function IconButton({
  variant = 'Primary',
  size = 'Medium',
  icon,
  'aria-label': ariaLabel,
  className,
  type = 'button',
  ...buttonProps
}: IconButtonProps) {
  if (ariaLabel.trim().length === 0) {
    throw new Error('IconButton requires a non-empty aria-label.')
  }

  if (icon == null) {
    throw new Error('IconButton requires an icon.')
  }

  const classes = [
    'tgg-icon-button',
    `tgg-icon-button--${variant.toLowerCase()}`,
    `tgg-icon-button--${size.toLowerCase()}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      {...buttonProps}
      type={type}
      className={classes}
      aria-label={ariaLabel}
    >
      <span className="tgg-icon-button__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
