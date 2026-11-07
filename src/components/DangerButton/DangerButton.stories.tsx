import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import {
  DangerButton,
  type DangerButtonSize,
  type DangerButtonVariant,
} from './DangerButton'
import { PlusIcon } from '../icons/PlusIcon'

const variants: DangerButtonVariant[] = ['Primary', 'Subtle']
const sizes: DangerButtonSize[] = ['Medium', 'Small']
const states = ['Default', 'Hover', 'Pressed', 'Disabled'] as const
type VisualState = (typeof states)[number]

const meta = {
  title: 'TGG/Components/Danger Button',
  component: DangerButton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    variant: 'Primary',
    size: 'Medium',
    label: 'Button',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: sizes },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    children: { control: false },
    startIcon: { control: false },
    endIcon: { control: false },
  },
} satisfies Meta<typeof DangerButton>

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
  if (state === 'Hover') return 'tgg-danger-button-story__state--hover'
  if (state === 'Pressed') return 'tgg-danger-button-story__state--pressed'
  return ''
}

function ThemeComparison({ args }: { args: Story['args'] }) {
  return (
    <div className="tgg-danger-button-story__matrix">
      {(['light', 'dark'] as const).map((theme) => (
        <section
          key={theme}
          className="tgg-danger-button-story__theme"
          data-tgg-theme={theme}
        >
          <h2 className="tgg-danger-button-story__size-heading">
            {theme === 'light' ? 'SDS Light' : 'SDS Dark'}
          </h2>
          {sizes.map((size) => (
            <section key={size}>
              <h3 className="tgg-danger-button-story__size-heading">{size}</h3>
              <div style={rowStyle}>
                {variants.map((variant) => (
                  <DangerButton
                    {...args}
                    key={`${variant}-${size}`}
                    variant={variant}
                    size={size}
                    label={`${variant} ${size}`}
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

function VisualStateMatrix({ args }: { args: Story['args'] }) {
  return (
    <div className="tgg-danger-button-story__matrix">
      {(['light', 'dark'] as const).map((theme) => (
        <section
          key={theme}
          className="tgg-danger-button-story__theme"
          data-tgg-theme={theme}
        >
          <h2 className="tgg-danger-button-story__size-heading">
            {theme === 'light' ? 'SDS Light' : 'SDS Dark'}
          </h2>
          {sizes.map((size) => (
            <section key={size}>
              <h3 className="tgg-danger-button-story__size-heading">{size}</h3>
              {variants.map((variant) => (
                <div key={variant} className="tgg-danger-button-story__matrix">
                  <h4 className="tgg-danger-button-story__state-label">
                    {variant}
                  </h4>
                  <div className="tgg-danger-button-story__row">
                    {states.map((state) => (
                      <div
                        key={state}
                        className={`tgg-danger-button-story__cell ${getStateClass(
                          state,
                        )}`}
                      >
                        <span className="tgg-danger-button-story__state-label">
                          {state}
                        </span>
                        <DangerButton
                          {...args}
                          variant={variant}
                          size={size}
                          label="Button"
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

export const PrimaryAndSubtleVariants: Story = {
  render: (args) => (
    <div style={rowStyle}>
      {variants.map((variant) => (
        <DangerButton
          {...args}
          key={variant}
          variant={variant}
          label={`${variant} Button`}
        />
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
}

export const MediumAndSmallSizes: Story = {
  render: (args) => (
    <div style={rowStyle}>
      {sizes.map((size) => (
        <DangerButton
          {...args}
          key={size}
          size={size}
          label={`${size} Button`}
        />
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
}

export const VariantAndSizeMatrix: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      {sizes.map((size) => (
        <section key={size}>
          <h2 className="tgg-danger-button-story__size-heading">{size}</h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <DangerButton
                {...args}
                key={`${variant}-${size}`}
                variant={variant}
                size={size}
                label={`${variant} ${size}`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Default appearance for both variants at both Figma sizes.',
      },
    },
  },
}

export const DisabledCombinations: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      {sizes.map((size) => (
        <section key={size}>
          <h2 className="tgg-danger-button-story__size-heading">
            {size} disabled
          </h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <DangerButton
                {...args}
                key={`${variant}-${size}`}
                variant={variant}
                size={size}
                label={`${variant} ${size}`}
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
      <p>
        Hover over a button, or press and hold it, to see its native states.
      </p>
      {sizes.map((size) => (
        <section key={size}>
          <h2 className="tgg-danger-button-story__size-heading">{size}</h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <DangerButton
                {...args}
                key={`${variant}-${size}`}
                variant={variant}
                size={size}
                label={`${variant} ${size}`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
}

export const WithStartIcon: Story = {
  args: { startIcon: <PlusIcon /> },
}

export const WithEndIcon: Story = {
  args: { endIcon: <PlusIcon /> },
}

export const WithBothIcons: Story = {
  args: {
    startIcon: <PlusIcon />,
    endIcon: <PlusIcon />,
  },
}

export const LightAndDarkThemes: Story = {
  render: (args) => <ThemeComparison args={args} />,
  parameters: { controls: { disable: true } },
}

export const VisualComparisonMatrix: Story = {
  render: (args) => <VisualStateMatrix args={args} />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Compares every variant, size, and state in SDS Light and SDS Dark. Hover and Pressed columns are visual references; try the Playground for live interaction.',
      },
    },
  },
}
