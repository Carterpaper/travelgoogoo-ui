import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { InputField } from './InputField'
import type {
  InputFieldProps,
  InputFieldState,
  InputFieldValueType,
  PasswordRequirement,
  PasswordRequirementStatus,
} from './InputField'
import { InfoAlertIcon } from '../icons/InfoAlertIcon'
import { PlusIcon } from '../icons/PlusIcon'

const states: InputFieldState[] = ['Default', 'Error', 'Disabled']
const valueTypes: InputFieldValueType[] = ['Default', 'Placeholder']

interface PasswordRequirementControls {
  requirement1Text?: string
  requirement1Status?: PasswordRequirementStatus
  requirement2Text?: string
  requirement2Status?: PasswordRequirementStatus
  requirement3Text?: string
  requirement3Status?: PasswordRequirementStatus
}

interface InputFieldStoryProps
  extends Omit<InputFieldProps, 'passwordRequirements' | 'showPasswordCaption'>,
    PasswordRequirementControls {
  showPasswordCaption?: boolean
}

const defaultRequirementTexts = [
  'At least 12 characters',
  'Includes uppercase and lowercase letters',
  'Includes a number and a symbol',
] as const

function InputFieldPlayground({
  showPasswordCaption,
  requirement1Text,
  requirement1Status,
  requirement2Text,
  requirement2Status,
  requirement3Text,
  requirement3Status,
  ...inputProps
}: InputFieldStoryProps) {
  const passwordRequirements: [
    PasswordRequirement,
    PasswordRequirement,
    PasswordRequirement,
  ] = [
    {
      text: requirement1Text ?? defaultRequirementTexts[0],
      status: requirement1Status ?? 'default',
    },
    {
      text: requirement2Text ?? defaultRequirementTexts[1],
      status: requirement2Status ?? 'default',
    },
    {
      text: requirement3Text ?? defaultRequirementTexts[2],
      status: requirement3Status ?? 'default',
    },
  ]

  return (
    <InputField
      {...inputProps}
      showPasswordCaption={showPasswordCaption}
      passwordRequirements={passwordRequirements}
      prefixIcon={inputProps.prefixIcon ?? <PlusIcon />}
      suffixIcon={inputProps.suffixIcon ?? <PlusIcon />}
      tooltipIcon={inputProps.tooltipIcon ?? <InfoAlertIcon />}
      tooltipText={inputProps.tooltipText ?? 'Additional information'}
    />
  )
}

const meta = {
  title: 'ATOM/Input Field/Component/Input Field',
  component: InputFieldPlayground,
  parameters: {
    layout: 'fullscreen',
    controls: { sort: 'none' },
  },
  tags: ['autodocs'],
  render: (args: InputFieldStoryProps) => <InputFieldPlayground {...args} />,
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
    passwordRequirements: { control: false, table: { disable: true } },
    requirement1Text: { control: 'text' },
    requirement1Status: {
      options: ['default', 'positive', 'error'],
      control: 'select',
    },
    requirement2Text: { control: 'text' },
    requirement2Status: {
      options: ['default', 'positive', 'error'],
      control: 'select',
    },
    requirement3Text: { control: 'text' },
    requirement3Status: {
      options: ['default', 'positive', 'error'],
      control: 'select',
    },
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
} satisfies Meta<InputFieldStoryProps> & {
  args: Record<string, unknown>
  argTypes: Record<string, unknown>
}

export default meta
type Story = StoryObj<typeof meta>
type StoryArgs = NonNullable<Story['args']>

function inputFieldProps(args: StoryArgs): Omit<StoryArgs, keyof PasswordRequirementControls> {
  const {
    requirement1Text: _requirement1Text,
    requirement1Status: _requirement1Status,
    requirement2Text: _requirement2Text,
    requirement2Status: _requirement2Status,
    requirement3Text: _requirement3Text,
    requirement3Status: _requirement3Status,
    ...props
  } = args

  return props
}

interface MatrixProps {
  args: StoryArgs
}

function renderFigmaVariantGallery({ args }: MatrixProps) {
  const props = inputFieldProps(args)

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
              {...props}
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
  const props = inputFieldProps(args)

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
            {...props}
            state="Error"
            hasDescription
            hasError
            description="Description"
            error="Error"
            label="Label"
          />
          <InputField
            {...props}
            state="Disabled"
            valueType="Placeholder"
            label="Disabled placeholder"
          />
        </section>
      ))}
    </div>
  )
}

function TooltipLayoutExamples() {
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
          <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
            <InputField
              label="Email"
              showTooltip
              tooltipIcon={<InfoAlertIcon />}
              tooltipText="Enter your email address."
            />
            <InputField
              label="Work email address used for account notifications and travel updates"
              showTooltip
              tooltipIcon={<InfoAlertIcon />}
              tooltipText="Use an address you can access."
            />
          </div>
        </section>
      ))}
    </div>
  )
}

export const Playground: Story = {
  args: {
    requirement1Text: defaultRequirementTexts[0],
    requirement1Status: 'default',
    requirement2Text: defaultRequirementTexts[1],
    requirement2Status: 'positive',
    requirement3Text: defaultRequirementTexts[2],
    requirement3Status: 'error',
  },
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
    showTooltip: true,
    tooltipIcon: <InfoAlertIcon />,
    tooltipText: 'Additional information',
    showPrefixText: true,
    showSuffixText: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'PlusIcon is supplied for prefix and suffix slots. InfoAlertIcon is supplied for the tooltip slot; the Input Field keeps these slots independent.',
      },
    },
  },
}

export const TooltipSlot: Story = {
  args: {
    showTooltip: true,
  },
  render: (args) => {
    const props = inputFieldProps(args)

    return (
      <div className="tgg-input-field-story__stack">
        <p className="tgg-input-field-story__caption">
          This example uses the reusable InfoAlertIcon. The tooltip slot can also
          accept consumer-provided icon content.
        </p>
        <InputField
          {...props}
          tooltipIcon={<InfoAlertIcon />}
          tooltipText="Additional information"
        />
      </div>
    )
  },
  parameters: { controls: { disable: true } },
}

export const TooltipLayout: Story = {
  render: () => <TooltipLayoutExamples />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Shows short and wrapping long labels with a trailing tooltip icon in both Light and Dark themes.',
      },
    },
  },
}

export const PasswordCaption: Story = {
  args: {
    type: 'password',
    showPasswordCaption: true,
    requirement1Text: defaultRequirementTexts[0],
    requirement1Status: 'default',
    requirement2Text: defaultRequirementTexts[1],
    requirement2Status: 'default',
    requirement3Text: defaultRequirementTexts[2],
    requirement3Status: 'default',
  },
}

function PasswordRequirementsThemeComparison({
  args,
}: {
  args: StoryArgs
}) {
  const {
    showPasswordCaption,
    requirement1Text,
    requirement1Status,
    requirement2Text,
    requirement2Status,
    requirement3Text,
    requirement3Status,
    ...props
  } = args
  const passwordRequirements: [
    PasswordRequirement,
    PasswordRequirement,
    PasswordRequirement,
  ] = [
    {
      text: requirement1Text ?? defaultRequirementTexts[0],
      status: requirement1Status ?? 'default',
    },
    {
      text: requirement2Text ?? defaultRequirementTexts[1],
      status: requirement2Status ?? 'default',
    },
    {
      text: requirement3Text ?? defaultRequirementTexts[2],
      status: requirement3Status ?? 'default',
    },
  ]

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
            {...props}
            type="password"
            showPasswordCaption={showPasswordCaption}
            passwordRequirements={passwordRequirements}
          />
        </section>
      ))}
    </div>
  )
}

export const PasswordRequirements: Story = {
  args: {
    type: 'password',
    showPasswordCaption: true,
    requirement1Text: defaultRequirementTexts[0],
    requirement1Status: 'default',
    requirement2Text: defaultRequirementTexts[1],
    requirement2Status: 'positive',
    requirement3Text: defaultRequirementTexts[2],
    requirement3Status: 'error',
  },
  render: (args) => <PasswordRequirementsThemeComparison args={args} />,
  parameters: {
    controls: {
      include: [
        'showPasswordCaption',
        'requirement1Text',
        'requirement1Status',
        'requirement2Text',
        'requirement2Status',
        'requirement3Text',
        'requirement3Status',
      ],
    },
    docs: {
      description: {
        story:
          'Edit each requirement text and status independently. Status selects its 16px icon and semantic colors. Both themes are shown.',
      },
    },
  },
}

export const LightAndDarkThemeComparison: Story = {
  render: (args) => <ThemeComparison args={args} />,
  parameters: { controls: { disable: true } },
}

export const NativeInputInteraction: Story = {
  args: {
    valueText: 'Type here',
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
