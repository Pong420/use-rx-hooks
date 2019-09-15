const path = require('path');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { compilerOptions } = require('../tsconfig.json');

const SRC_PATH = path.join(__dirname, '../src');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    loader: 'ts-loader',
    include: [SRC_PATH],
    options: {
      transpileOnly: true, // use transpileOnly mode to speed-up compilation
      compilerOptions: {
        ...compilerOptions,
        declaration: false,
      },
    },
  });

  config.module.rules.push({
    test: /\.(stories|story)\.mdx$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          // may or may not need this line depending on your app's setup
          plugins: ['@babel/plugin-transform-react-jsx'],
        },
      },
      {
        loader: '@mdx-js/loader',
        options: {
          compilers: [createCompiler({})],
        },
      },
    ],
  });

  config.module.rules.push({
    test: /\.(stories|story)\.[tj]sx?$/,
    loader: require.resolve('@storybook/source-loader'),
    exclude: [/node_modules/],
    enforce: 'pre',
  });

  config.resolve.extensions.push('.ts', '.tsx');

  config.plugins.push(new ForkTsCheckerWebpackPlugin());

  return config;
};
