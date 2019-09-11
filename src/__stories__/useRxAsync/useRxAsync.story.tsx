import React from 'react';
import { storiesOf } from '@storybook/react';
import { Basic } from './Basic';

storiesOf('useRxAsync', module).add(
  'Basic',
  () => <Basic></Basic>,
  { info: { inline: true, header: false } } // Make your component render inline with the additional info
);
