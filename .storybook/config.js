import { configure } from '@storybook/react';

import '!style-loader!css-loader!sass-loader!../src/__stories__/global.scss';

configure(
  require.context(
    '../src/',
    true,
    /.*\.(stories|story)\.(js|jsx|ts|tsx|mdx)?$/
  ),
  module
);
