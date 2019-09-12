import React from 'react';
import { storiesOf } from '@storybook/react';
import { Basic } from './Basic';
import { Cancellation } from './Cancellation';
import { Defer } from './Defer';
import { Dynamic } from './Dynamic';
import { Transform } from './Transform';

storiesOf('useRxAsync', module)
  .add('Basic', () => <Basic></Basic>)
  .add('Cancellation', () => <Cancellation></Cancellation>)
  .add('Defer', () => <Defer></Defer>)
  .add('Dynamic', () => <Dynamic></Dynamic>)
  .add('Transform', () => <Transform></Transform>);
