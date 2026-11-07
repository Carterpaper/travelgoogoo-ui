import { useEffect, useId, useRef, useState } from 'react'
import type {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
} from 'react'

import './Checkbox.css'

export type CheckboxState = 'Default' | 'Disabled'
export type CheckboxValueType = 'Unchecked' | 'Checked' | 'Indeterminate'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  state?: CheckboxState
  valueType?: CheckboxValueType
  label?: ReactNode
  description?: ReactNode
  hasDescription?: boolean
}

export function Checkbox({
  state = 'Default',
  valueType = 'Unchecked',
  label = 'Label',
  description = 'Description',
  hasDescription = true,
  className,
  disabled = false,
  checked,
  defaultChecked,
  onChange,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const descriptionId = useId()
  const isControlled = checked !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(() => ({
    valueType,
    checked: defaultChecked ?? valueType === 'Checked',
    indeterminate: valueType === 'Indeterminate',
  }))
  const currentUncontrolledValue =
    uncontrolledValue.valueType === valueType
      ? uncontrolledValue
      : {
          valueType,
          checked: defaultChecked ?? valueType === 'Checked',
          indeterminate: valueType === 'Indeterminate',
        }
  const uncontrolledChecked = currentUncontrolledValue.checked
  const isIndeterminate = currentUncontrolledValue.indeterminate
  const isDisabled = state === 'Disabled' || disabled
  const describedBy = [
    ariaDescribedBy,
    hasDescription ? descriptionId : undefined,
  ]
    .filter(Boolean)
    .join(' ') || undefined

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate
    }
  }, [isIndeterminate])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setUncontrolledValue({
      valueType,
      checked: event.currentTarget.checked,
      indeterminate: false,
    })

    onChange?.(event)
  }

  const classes = [
    'tgg-checkbox',
    ...(isDisabled ? ['tgg-checkbox--disabled'] : []),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <label className="tgg-checkbox__field">
        <span className="tgg-checkbox__control">
          <input
            {...inputProps}
            ref={inputRef}
            type="checkbox"
            className="tgg-checkbox__input"
            checked={isControlled ? checked : uncontrolledChecked}
            disabled={isDisabled}
            aria-describedby={describedBy}
            onChange={handleChange}
          />
          <span
            className={`tgg-checkbox__icon tgg-checkbox__icon--check${
              isDisabled ? ' tgg-checkbox__icon--disabled' : ''
            }`}
            aria-hidden="true"
          />
          <span
            className={`tgg-checkbox__icon tgg-checkbox__icon--minus${
              isDisabled ? ' tgg-checkbox__icon--disabled' : ''
            }`}
            aria-hidden="true"
          />
        </span>
        <span className="tgg-checkbox__content">
          <span className="tgg-checkbox__label">{label}</span>
          {hasDescription && (
            <span
              className="tgg-checkbox__description"
              id={descriptionId}
            >
              {description}
            </span>
          )}
        </span>
      </label>
    </div>
  )
}
