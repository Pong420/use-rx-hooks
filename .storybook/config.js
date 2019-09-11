import { configure, addDecorator } from '@storybook/react';
import centered from '@storybook/addon-centered/react';

import '!style-loader!css-loader!sass-loader!../global.scss';

addDecorator(centered);

// automatically import all files ending in *.stories.js
const req = require.context('../src/', true, /.*\.(stories|story)\.(js|jsx|ts|tsx)?$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
