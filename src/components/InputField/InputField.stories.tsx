import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { InputField } from './InputField'
import type { InputFieldState, InputFieldValueType } from './InputField'
import { PlusIcon } from '../icons/PlusIcon'

const states: InputFieldState[] = ['Default', 'Error', 'Disabled']
const valueTypes: InputFieldValueType[] = ['Default', 'Placeholder']

const meta = {
  title: 'ATOM/Input Field/Component/Input Field',
  component: InputField,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    state: 'Default',
    valueType: 'Default',
    hasError: false,
    error: 'Error',
    hasDescription: false,
    description: 'Description',
    valueText: 'Value',
    showPrefixIcon: false,
    showSuffixIcon: false,
    showPrefixText: false,
    prefixText: '$',
    showSuffixText: false,
    suffixText: 'USD',
    showTooltip: false,
    hasLabel: true,
    showLabel: true,
    label: 'Label',
    showPasswordCaption: false,
    type: 'text',
    onChange: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: states },
    valueType: { control: 'inline-radio', options: valueTypes },
    hasError: { control: 'boolean' },
    error: { control: 'text' },
    hasDescription: { control: 'boolean' },
    description: { control: 'text' },
    valueText: { control: 'text' },
    showPrefixIcon: { control: 'boolean' },
    prefixIcon: { control: false },
    showSuffixIcon: { control: 'boolean' },
    suffixIcon: { control: false },
    showPrefixText: { control: 'boolean' },
    prefixText: { control: 'text' },
    showSuffixText: { control: 'boolean' },
    suffixText: { control: 'text' },
    showTooltip: { control: 'boolean' },
    tooltipIcon: { control: false },
    tooltipText: { control: 'text' },
    hasLabel: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    label: { control: 'text' },
    showPasswordCaption: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'search', 'tel', 'url', 'number'],
    },
    value: { control: false },
    defaultValue: { control: false },
    placeholder: { control: false },
    disabled: { control: false },
    className: { control: false },
    onChange: { control: false },
  },
} satisfies Meta<typeof InputField>

export default meta
type Story = StoryObj<typeof meta>

interface MatrixProps {
  args: NonNullable<Story['args']>
}

function renderFigmaVariantGallery({ args }: MatrixProps) {
  return (
    <div className="tgg-input-field-story__gallery">
      {states.flatMap((state) =>
        valueTypes.map((valueType) => (
          <div
            className="tgg-input-field-story__cell"
            key={`${state}-${valueType}`}
          >
            <p className="tgg-input-field-story__caption">
              {state} / {valueType}
            </p>
            <InputField
              {...args}
              state={state}
              valueType={valueType}
              label="Label"
              hasLabel
              showLabel
              hasDescription={false}
              hasError={false}
              showPasswordCaption={false}
              showPrefixIcon={false}
              showSuffixIcon={false}
              showPrefixText={false}
              showSuffixText={false}
              showTooltip={false}
            />
          </div>
        )),
      )}
    </div>
  )
}

function ThemeComparison({ args }: MatrixProps) {
  return (
    <div className="tgg-input-field-story__stack">
      {(['light', 'dark'] as const).map((theme) => (
        <section
          key={theme}
          className="tgg-input-field-story__theme"
          data-tgg-theme={theme}
        >
          <h2 className="tgg-input-field-story__heading">
            {theme === 'light' ? 'SDS Light' : 'SDS Dark'}
          </h2>
          <InputField
            {...args}
            state="Error"
            hasDescription
            hasError
            description="Description"
            error="Error"
            label="Label"
          />
          <InputField
            {...args}
            state="Disabled"
            valueType="Placeholder"
            label="Disabled placeholder"
          />
        </section>
      ))}
    </div>
  )
}

// valueType switches between an uncontrolled initial value and a placeholder.
// Remount the preview when that mode changes so the native input is initialized
// with the correct mode instead of retaining its previous uncontrolled value.
export const Playground: Story = {
  render: (args) => <InputField key={args.valueType} {...args} />,
}

export const FigmaVariantGallery: Story = {
  render: (args) => renderFigmaVariantGallery({ args }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Shows the six state and value-type combinations from Figma.',
      },
    },
  },
}

export const DefaultExample: Story = {}

export const PlaceholderExample: Story = {
  args: { valueType: 'Placeholder' },
}

export const ErrorExample: Story = {
  args: {
    state: 'Error',
    hasError: true,
    error: 'Please enter a valid value.',
  },
}

export const DisabledExample: Story = {
  args: { state: 'Disabled' },
}

export const DescriptionAndError: Story = {
  args: {
    state: 'Error',
    hasDescription: true,
    description: 'Description text.',
    hasError: true,
    error: 'Error text.',
  },
}

export const PrefixAndSuffixText: Story = {
  args: {
    showPrefixText: true,
    prefixText: '$',
    showSuffixText: true,
    suffixText: 'USD',
  },
}

export const ConsumerSuppliedIcons: Story = {
  args: {
    showPrefixIcon: true,
    prefixIcon: <PlusIcon />,
    showSuffixIcon: true,
    suffixIcon: <PlusIcon />,
    showPrefixText: true,
    showSuffixText: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'PlusIcon is supplied by this story as a custom slot example; the component does not add default icons.',
      },
    },
  },
}

export const TooltipSlot: Story = {
  args: {
    showTooltip: true,
  },
  render: (args) => (
    <div className="tgg-input-field-story__stack">
      <p className="tgg-input-field-story__caption">
        No Info icon is available in the project, so no tooltip icon is drawn.
        Supply a consumer-owned tooltipIcon to display one.
      </p>
      <InputField {...args} />
    </div>
  ),
  parameters: { controls: { disable: true } },
}

export const PasswordCaption: Story = {
  args: {
    type: 'password',
    showPasswordCaption: true,
  },
}

export const LightAndDarkThemeComparison: Story = {
  render: (args) => <ThemeComparison args={args} />,
  parameters: { controls: { disable: true } },
}

export const NativeInputInteraction: Story = {
  args: {
    defaultValue: 'Type here',
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Type into the input to exercise native editing, keyboard, and selection behavior.',
      },
    },
  },
}

export const AccessibilityExamples: Story = {
  render: () => (
    <div className="tgg-input-field-story__stack">
      <InputField
        label="Email address"
        type="email"
        autoComplete="email"
        required
        hasDescription
        description="We will use this address for account updates."
      />
      <InputField
        label="Password"
        type="password"
        autoComplete="new-password"
        hasDescription
        description="Choose a password for your account."
        showPasswordCaption
      />
      <InputField
        label="Search"
        hasLabel={false}
        showLabel={false}
        aria-label="Search destinations"
        placeholder="Search destinations"
      />
    </div>
  ),
  parameters: { controls: { disable: true } },
}
