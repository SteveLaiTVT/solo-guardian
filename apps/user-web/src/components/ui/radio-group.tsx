/**
 * @file radio-group.tsx
 * @description RadioGroup component based on shadcn/ui patterns
 * @task TASK-037
 * @design_state_version 3.4.0
 */
import * as React from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
}

interface RadioGroupItemProps {
  value: string
  id: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

interface RadioGroupContextType {
  value: string
  onValueChange: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null)

function useRadioGroupContext(): RadioGroupContextType {
  const context = React.useContext(RadioGroupContext)
  if (!context) {
    throw new Error('RadioGroupItem must be used within a RadioGroup')
  }
  return context
}

// DONE(B): Implemented RadioGroup - TASK-037
export function RadioGroup({
  value,
  onValueChange,
  className,
  children,
}: RadioGroupProps): JSX.Element {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div role="radiogroup" className={cn('grid gap-2', className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

// DONE(B): Implemented RadioGroupItem - TASK-037
export function RadioGroupItem({
  value,
  id,
  disabled = false,
  className,
}: RadioGroupItemProps): JSX.Element {
  const { value: groupValue, onValueChange } = useRadioGroupContext()
  const isChecked = groupValue === value

  const handleClick = (): void => {
    if (!disabled) {
      onValueChange(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      type="button"
      role="radio"
      id={id}
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary',
        'ring-offset-background focus:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'flex items-center justify-center',
        className
      )}
    >
      {isChecked && (
        <span className="h-2.5 w-2.5 rounded-full bg-current" />
      )}
    </button>
  )
}
