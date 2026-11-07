import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    brandTitle: 'Travelgoogoo',
    brandImage: '/travelgoogoo-logo.svg',
    brandUrl: '/',
    brandTarget: '_self',
  }),
});