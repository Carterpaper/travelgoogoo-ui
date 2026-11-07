import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import {
  IconButton,
  type IconButtonSize,
  type IconButtonVariant,
} from './IconButton'
import { PlusIcon } from '../icons/PlusIcon'

const variants: IconButtonVariant[] = ['Primary', 'Neutral', 'Subtle']
const sizes: IconButtonSize[] = ['Medium', 'Small']
const states = ['Default', 'Hover', 'Pressed', 'Disabled'] as const
type VisualState = (typeof states)[number]

const meta = {
  title: 'TGG/Components/Icon Button',
  component: IconButton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    variant: 'Primary',
    size: 'Medium',
    icon: <PlusIcon />,
    'aria-label': 'Add item',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: sizes },
    icon: { control: false },
    'aria-label': { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

const matrixStyle: CSSProperties = {
  display: 'grid',
  gap: 24,
}

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 16,
}

function getStateClass(state: VisualState) {
  if (state === 'Hover') return 'tgg-icon-button-story__state--hover'
  if (state === 'Pressed') return 'tgg-icon-button-story__state--pressed'
  return ''
}

interface MatrixProps {
  args: NonNullable<Story['args']>
}

function ThemeComparison({ args }: MatrixProps) {
  return (
    <div className="tgg-icon-button-story__matrix">
      {(['light', 'dark'] as const).map((theme) => (
        <section
          key={theme}
          className="tgg-icon-button-story__theme"
          data-tgg-theme={theme}
        >
          <h2 className="tgg-icon-button-story__heading">
            {theme === 'light' ? 'SDS Light' : 'SDS Dark'}
          </h2>
          {sizes.map((size) => (
            <section key={size}>
              <h3 className="tgg-icon-button-story__heading">{size}</h3>
              <div className="tgg-icon-button-story__row">
                {variants.map((variant) => (
                  <IconButton
                    {...args}
                    key={`${variant}-${size}`}
                    variant={variant}
                    size={size}
                    icon={args.icon ?? <PlusIcon />}
                    aria-label={`${variant} ${size}, add item`}
                  />
                ))}
              </div>
            </section>
          ))}
        </section>
      ))}
    </div>
  )
}

function VisualComparisonMatrix({ args }: MatrixProps) {
  return (
    <div className="tgg-icon-button-story__matrix">
      {(['light', 'dark'] as const).map((theme) => (
        <section
          key={theme}
          className="tgg-icon-button-story__theme"
          data-tgg-theme={theme}
        >
          <h2 className="tgg-icon-button-story__heading">
            {theme === 'light' ? 'SDS Light' : 'SDS Dark'}
          </h2>
          {sizes.map((size) => (
            <section key={size} className="tgg-icon-button-story__matrix">
              <h3 className="tgg-icon-button-story__heading">{size}</h3>
              {variants.map((variant) => (
                <div key={variant} className="tgg-icon-button-story__matrix">
                  <h4 className="tgg-icon-button-story__state-label">
                    {variant}
                  </h4>
                  <div className="tgg-icon-button-story__row">
                    {states.map((state) => (
                      <div
                        key={state}
                        className={`tgg-icon-button-story__cell ${getStateClass(
                          state,
                        )}`}
                      >
                        <span className="tgg-icon-button-story__state-label">
                          {state}
                        </span>
                        <IconButton
                          {...args}
                          variant={variant}
                          size={size}
                          icon={args.icon ?? <PlusIcon />}
                          aria-label={`${variant} ${size}, ${state}`}
                          disabled={state === 'Disabled'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </section>
      ))}
    </div>
  )
}

export const Playground: Story = {}

export const DefaultVariantAndSizeMatrix: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      {sizes.map((size) => (
        <section key={size}>
          <h2 className="tgg-icon-button-story__heading">{size}</h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <IconButton
                {...args}
                key={`${variant}-${size}`}
                variant={variant}
                size={size}
                aria-label={`${variant} ${size}, add item`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
}

export const DisabledMatrix: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      {sizes.map((size) => (
        <section key={size}>
          <h2 className="tgg-icon-button-story__heading">
            {size} disabled
          </h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <IconButton
                {...args}
                key={`${variant}-${size}`}
                variant={variant}
                size={size}
                aria-label={`${variant} ${size}, disabled add item`}
                disabled
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
}

export const HoverAndPressed: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      <p>Hover over or press and hold an enabled button to see its states.</p>
      {sizes.map((size) => (
        <section key={size}>
          <h2 className="tgg-icon-button-story__heading">{size}</h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <IconButton
                {...args}
                key={`${variant}-${size}`}
                variant={variant}
                size={size}
                aria-label={`${variant} ${size}, add item`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
}

export const LightAndDarkThemeComparison: Story = {
  render: (args) => <ThemeComparison args={args} />,
  parameters: { controls: { disable: true } },
}

export const FullVisualComparisonMatrix: Story = {
  render: (args) => <VisualComparisonMatrix args={args} />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Compares every variant, size, and state in both themes. Hover and Pressed columns are visual references; use Playground to interact with the button.',
      },
    },
  },
}
