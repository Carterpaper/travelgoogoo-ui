import type { Preview } from '@storybook/react-vite';

import '../src/design-tokens/index.css';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'TGG design system color mode',
      defaultValue: 'light',
      toolbar: {
        title: 'TGG theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'SDS Light' },
          { value: 'dark', title: 'SDS Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <div
        data-tgg-theme={context.globals.theme ?? 'light'}
        style={{
          minHeight: '100%',
          padding: 24,
          backgroundColor: 'var(--tgg-color-background-default-default)',
          color: 'var(--tgg-color-text-default-default-black)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;