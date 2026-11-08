import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import {
  Checkbox,
  type CheckboxState,
  type CheckboxValueType,
} from './Checkbox'

const states: CheckboxState[] = ['Default', 'Disabled']
const valueTypes: CheckboxValueType[] = [
  'Unchecked',
  'Checked',
  'Indeterminate',
]

const meta = {
  title: 'ATOM/Checkbox/Component/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    state: 'Default',
    valueType: 'Unchecked',
    label: 'Label',
    description: 'Description',
    hasLabel: true,
    hasDescription: true,
    onChange: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: states },
    valueType: { control: 'inline-radio', options: valueTypes },
    label: { control: 'text' },
    description: { control: 'text' },
    hasLabel: { control: 'boolean' },
    hasDescription: { control: 'boolean' },
    disabled: { control: false },
    checked: { control: false },
    defaultChecked: { control: false },
    onChange: { control: false },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

const matrixStyle: CSSProperties = {
  display: 'grid',
  gap: 24,
}

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: 24,
}

interface MatrixProps {
  args: NonNullable<Story['args']>
}

function CheckboxMatrix({
  args,
  state,
}: MatrixProps & { state: CheckboxState }) {
  return (
    <div className="tgg-checkbox-story__matrix">
      <div className="tgg-checkbox-story__row">
        {valueTypes.map((valueType) => (
          <div
            className="tgg-checkbox-story__cell"
            key={`${state}-${valueType}`}
          >
            <span className="tgg-checkbox-story__state-label">
              {valueType}
            </span>
            <Checkbox
              {...args}
              key={valueType}
              state={state}
              valueType={valueType}
              label={`${state} ${valueType}`}
              description="Description text"
              hasDescription={args.hasDescription}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function ThemeComparison({ args }: MatrixProps) {
  return (
    <div className="tgg-checkbox-story__matrix">
      {(['light', 'dark'] as const).map((theme) => (
        <section
          key={theme}
          className="tgg-checkbox-story__theme"
          data-tgg-theme={theme}
        >
          <h2 className="tgg-checkbox-story__heading">
            {theme === 'light' ? 'SDS Light' : 'SDS Dark'}
          </h2>
          {states.map((state) => (
            <section key={state} className="tgg-checkbox-story__matrix">
              <h3 className="tgg-checkbox-story__heading">{state}</h3>
              <CheckboxMatrix args={args} state={state} />
            </section>
          ))}
        </section>
      ))}
    </div>
  )
}

export const Playground: Story = {}

export const LabelVisibilityExamples: Story = {
  render: (args) => (
    <div style={rowStyle}>
      <Checkbox {...args} hasLabel label="With label and description" />
      <Checkbox {...args} hasLabel={false} label="Checkbox only" />
    </div>
  ),
  parameters: { controls: { disable: true } },
}

export const ValueTypeMatrix: Story = {
  render: (args) => (
    <div style={matrixStyle}>
      <div style={rowStyle}>
        {valueTypes.map((valueType) => (
          <Checkbox
            {...args}
            key={valueType}
            valueType={valueType}
            label={`Default ${valueType}`}
          />
        ))}
      </div>
    </div>
  ),
  parameters: { controls: { disable: true } },
}

export const DisabledMatrix: Story = {
  render: (args) => <CheckboxMatrix args={args} state="Disabled" />,
  parameters: { controls: { disable: true } },
}

export const LightAndDarkThemeComparison: Story = {
  render: (args) => <ThemeComparison args={args} />,
  parameters: { controls: { disable: true } },
}

export const FullVisualComparisonMatrix: Story = {
  render: (args) => <ThemeComparison args={args} />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Compares all six Figma combinations in SDS Light and SDS Dark. The component does not add hover, pressed, focus, or error designs.',
      },
    },
  },
}
