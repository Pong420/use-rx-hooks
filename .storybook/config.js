import { configure, addParameters } from '@storybook/react';

import '!style-loader!css-loader!sass-loader!../global.scss';

configure(require.context('../src/', true, /.*\.(stories|story)\.(js|jsx|ts|tsx|mdx)?$/), module);
