import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { ArrowUpRightIcon } from '../icons/ArrowUpRightIcon'
import './Button.css'

export type ButtonVariant = 'Primary' | 'Neutral' | 'Subtle'
export type ButtonSize = 'Medium' | 'Small'
export type ButtonLayout = 'standard' | 'split'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  layout?: ButtonLayout
  children?: ReactNode
  label?: ReactNode
  startIcon?: ReactNode
  endIcon?: ReactNode
}

export function Button({
  variant = 'Primary',
  size = 'Medium',
  layout = 'standard',
  children,
  label,
  startIcon,
  endIcon,
  className,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  const classes = [
    'tgg-button',
    `tgg-button--${variant.toLowerCase()}`,
    `tgg-button--${size.toLowerCase()}`,
    ...(layout === 'split' ? ['tgg-button--split'] : []),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button {...buttonProps} type={type} className={classes}>
      {layout === 'split' ? (
        <>
          <span className="tgg-button__split-content">
            {startIcon != null && (
              <span className="tgg-button__icon" aria-hidden="true">
                {startIcon}
              </span>
            )}
            <span className="tgg-button__label tgg-button__split-label">
              {children ?? label}
            </span>
          </span>
          <span className="tgg-button__split-icon" aria-hidden="true">
            {endIcon ?? <ArrowUpRightIcon />}
          </span>
        </>
      ) : (
        <>
          {startIcon != null && (
            <span className="tgg-button__icon" aria-hidden="true">
              {startIcon}
            </span>
          )}
          <span className="tgg-button__label">{children ?? label}</span>
          {endIcon != null && (
            <span className="tgg-button__icon" aria-hidden="true">
              {endIcon}
            </span>
          )}
        </>
      )}
    </button>
  )
}
