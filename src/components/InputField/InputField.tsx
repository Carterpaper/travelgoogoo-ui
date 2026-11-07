import { useId } from 'react'
import type {
  InputHTMLAttributes,
  ReactNode,
} from 'react'

import './InputField.css'

export type InputFieldState = 'Default' | 'Error' | 'Disabled'
export type InputFieldValueType = 'Default' | 'Placeholder'

export interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  state?: InputFieldState
  valueType?: InputFieldValueType
  hasError?: boolean
  error?: ReactNode
  hasDescription?: boolean
  description?: ReactNode
  valueText?: string
  showPrefixIcon?: boolean
  prefixIcon?: ReactNode
  showSuffixIcon?: boolean
  suffixIcon?: ReactNode
  showPrefixText?: boolean
  prefixText?: string
  showSuffixText?: boolean
  suffixText?: string
  showTooltip?: boolean
  tooltipIcon?: ReactNode
  tooltipText?: string
  hasLabel?: boolean
  showLabel?: boolean
  label?: ReactNode
  showPasswordCaption?: boolean
  className?: string
}

const passwordCaptionLines = [
  'At least 12 characters',
  'Contains at least 1 uppercase and 1 lowercase letters',
  'Contains at least 1 number and 1 symbol',
]

export function InputField({
  state = 'Default',
  valueType = 'Default',
  hasError = false,
  error = 'Error',
  hasDescription = false,
  description = 'Description',
  valueText = 'Value',
  showPrefixIcon = false,
  prefixIcon,
  showSuffixIcon = false,
  suffixIcon,
  showPrefixText = false,
  prefixText = '$',
  showSuffixText = false,
  suffixText = 'USD',
  showTooltip = false,
  tooltipIcon,
  tooltipText,
  hasLabel = true,
  showLabel = true,
  label = 'Label',
  showPasswordCaption = false,
  className,
  id,
  type = 'text',
  disabled = false,
  value,
  defaultValue,
  placeholder,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...inputProps
}: InputFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = useId()
  const errorId = useId()
  const passwordCaptionId = useId()
  const isDisabled = state === 'Disabled' || disabled
  const isError = state === 'Error'
  const isVisibleLabel = hasLabel && showLabel
  const isVisibleTooltip = hasLabel && showTooltip && tooltipIcon != null
  const inputDefaultValue =
    value !== undefined
      ? undefined
      : defaultValue ?? (valueType === 'Default' ? valueText : undefined)
  const inputPlaceholder =
    valueType === 'Placeholder' ? (placeholder ?? valueText) : placeholder
  const describedBy =
    [
      ariaDescribedBy,
      hasDescription ? descriptionId : undefined,
      hasError ? errorId : undefined,
      showPasswordCaption ? passwordCaptionId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined

  const classes = [
    'tgg-input-field',
    `tgg-input-field--${state.toLowerCase()}`,
    `tgg-input-field--${valueType.toLowerCase()}`,
    ...(isDisabled ? ['tgg-input-field--native-disabled'] : []),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {!isVisibleLabel && (
        <label
          className="tgg-input-field__visually-hidden"
          htmlFor={inputId}
        >
          {label}
        </label>
      )}
      {hasLabel && (isVisibleLabel || isVisibleTooltip) && (
        <div className="tgg-input-field__title">
          {isVisibleLabel && (
            <label className="tgg-input-field__label" htmlFor={inputId}>
              {label}
            </label>
          )}
          {isVisibleTooltip && (
            <span
              className="tgg-input-field__tooltip-icon"
              role={tooltipText ? 'img' : undefined}
              aria-label={tooltipText}
              aria-hidden={tooltipText ? undefined : true}
              title={tooltipText}
            >
              {tooltipIcon}
            </span>
          )}
        </div>
      )}
      <div className="tgg-input-field__control">
        {showPrefixIcon && prefixIcon != null && (
          <span className="tgg-input-field__icon" aria-hidden="true">
            {prefixIcon}
          </span>
        )}
        {showPrefixText && (
          <span className="tgg-input-field__affix">{prefixText}</span>
        )}
        <input
          {...inputProps}
          id={inputId}
          type={type}
          className="tgg-input-field__input"
          disabled={isDisabled}
          value={value}
          defaultValue={inputDefaultValue}
          placeholder={inputPlaceholder}
          aria-invalid={isError ? true : ariaInvalid}
          aria-describedby={describedBy}
        />
        {showSuffixText && (
          <span className="tgg-input-field__affix">{suffixText}</span>
        )}
        {showSuffixIcon && suffixIcon != null && (
          <span className="tgg-input-field__icon" aria-hidden="true">
            {suffixIcon}
          </span>
        )}
      </div>
      {(hasDescription || hasError) && (
        <div className="tgg-input-field__supporting">
          {hasDescription && (
            <div
              className="tgg-input-field__description"
              id={descriptionId}
            >
              {description}
            </div>
          )}
          {hasError && (
            <div className="tgg-input-field__error" id={errorId}>
              {error}
            </div>
          )}
        </div>
      )}
      {showPasswordCaption && (
        <ul
          className="tgg-input-field__password-caption"
          id={passwordCaptionId}
        >
          {passwordCaptionLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
