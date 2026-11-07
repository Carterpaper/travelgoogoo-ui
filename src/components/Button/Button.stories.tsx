import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import {
  Button,
  type ButtonLayout,
  type ButtonSize,
  type ButtonVariant,
} from './Button'
import { PlusIcon } from '../icons/PlusIcon'

const variants: ButtonVariant[] = ['Primary', 'Neutral', 'Subtle']
const sizes: ButtonSize[] = ['Medium', 'Small']
const layouts: ButtonLayout[] = ['standard', 'split']

const meta = {
  title: 'TGG/Components/Button/Button',
  component: Button,
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
    layout: { control: 'inline-radio', options: layouts },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    children: { control: false },
    startIcon: { control: false },
    endIcon: { control: false },
  },
} satisfies Meta<typeof Button>

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

export const Playground: Story = {}

export const VariantAndSizeMatrix: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      {sizes.map((size) => (
        <section key={size}>
          <h2>{size}</h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <Button
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
        story: 'Default state for all three variants at both Figma sizes.',
      },
    },
  },
}

export const DisabledMatrix: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      {sizes.map((size) => (
        <section key={size}>
          <h2>{size} disabled</h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <Button
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
  parameters: {
    controls: { disable: true },
  },
}

export const HoverAndPressed: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      <p className="tgg-button-story__description">
        Hover over a button, or press and hold it, to see its native states.
      </p>
      {sizes.map((size) => (
        <section key={size}>
          <h2 className="tgg-button-story__section-heading">{size}</h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <Button
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
  },
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

export const SplitDefaultMatrix: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      {sizes.map((size) => (
        <section key={size}>
          <h2>{size}</h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <Button
                {...args}
                key={`${variant}-${size}`}
                layout="split"
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
  },
}

export const SplitHoverMatrix: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      <p>Hover over or press a button to inspect its Hover and Pressed states.</p>
      {sizes.map((size) => (
        <section key={size}>
          <h2>{size}</h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <Button
                {...args}
                key={`${variant}-${size}`}
                layout="split"
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
  },
}

export const SplitWithCustomEndIcon: Story = {
  args: {
    layout: 'split',
    endIcon: <PlusIcon />,
  },
}

export const SplitWithStartIcon: Story = {
  args: {
    layout: 'split',
    startIcon: <PlusIcon />,
  },
}

export const SplitSingleLineOverflow: Story = {
  render: (args) => (
    <div style={{ maxWidth: '100%', width: 240 }}>
      <Button
        {...args}
        layout="split"
        size="Medium"
        label="Continue to destination"
        style={{ width: '100%' }}
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The label stays on one line; the button can exceed the 240px container when needed.',
      },
    },
  },
}

export const SplitDisabledMatrix: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      {sizes.map((size) => (
        <section key={size}>
          <h2>{size} disabled</h2>
          <div style={rowStyle}>
            {variants.map((variant) => (
              <Button
                {...args}
                key={`${variant}-${size}`}
                layout="split"
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
  parameters: {
    controls: { disable: true },
  },
}

export const SplitContainerWidths: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      {[240, 360].map((width) => (
        <section key={width} style={{ maxWidth: '100%', width }}>
          <h2>{width}px container</h2>
          <div style={matrixStyle}>
            {variants.map((variant) => (
              <Button
                {...args}
                key={variant}
                layout="split"
                variant={variant}
                size="Medium"
                label="Continue to destination"
                style={{ width: '100%' }}
              />
            ))}
          </div>
        </section>
      ))}
      <section style={{ width: '100%' }}>
        <h2>Full-width container</h2>
        <Button
          {...args}
          layout="split"
          variant="Primary"
          size="Small"
          label="Primary small"
          style={{ width: '100%' }}
        />
      </section>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}
