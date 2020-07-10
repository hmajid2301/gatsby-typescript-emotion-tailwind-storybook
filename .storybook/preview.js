import React from 'react';

import { configure, addDecorator, addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { setIntlConfig, withIntl } from 'storybook-addon-intl';

import { addLocaleData } from 'gatsby-plugin-intl';
import enLocaleData from 'react-intl/locale-data/en';
import esLocaleData from 'react-intl/locale-data/es';

import { EmotionThemeProvider, GatsbyIntlProvider } from './decorators';
import GlobalStyles from '../src/components/Layout/GlobalStyles';
import '~/styles/globals.css';
import './main.css';

configure(require.context('../src', true, /\.stories\.mdx$/), module);

// Gatsby Setup
// ============================================
// Gatsby's Link overrides:
// Gatsby defines a global called ___loader to prevent its method calls from creating console errors you override it here
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
};
// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
global.__PATH_PREFIX__ = '';
// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
window.___navigate = pathname => {
  action('NavigateTo:')(pathname);
};

// Storybook Addons
// ============================================
// TODO: Add our breakpoints to the list of viewport options
addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'responsive',
  },
  options: {
    panelPosition: 'right',
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
});

// Storybook Decorators
// ============================================
// Global Styles ==============================
addDecorator(story => (
  <>
    <GlobalStyles />
    <div style={{ padding: '3rem' }}>{story()}</div>
  </>
));

// Emotion Theme Provider =====================
addDecorator(EmotionThemeProvider);

// gatsby-plugin-intl Provider ================
// Set supported locales
export const locales = ['en-us', 'es-es'];

// Import translation messages
export const messages = locales.reduce((acc, locale) => {
  return {
    ...acc,
    [locale]: require(`../src/locales/${locale}.json`),
  };
}, {});

const getMessages = locale => messages[locale];

// Set `storybook-addon-intl` configuration (handles `react-intl`)
setIntlConfig({
  locales,
  defaultLocale: 'en-us',
  getMessages,
});

// Load the locale data for all your supported locales
addLocaleData(enLocaleData);
addLocaleData(esLocaleData);

// Register decorators
// Adds gatsby-plugin-intl IntlContextProvider which wraps the Gatsby Link component
addDecorator(GatsbyIntlProvider);
// Adds react-intl
addDecorator(withIntl);
