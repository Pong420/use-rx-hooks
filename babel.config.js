module.exports = {
  presets: ['@babel/preset-typescript', '@babel/preset-env'],
  plugins: [
    [
      'import',
      {
        libraryDirectory: '../_esm5/internal/operators',
        libraryName: 'rxjs/operators',
        camel2DashComponentName: false,
        transformToDefaultImport: false,
      },
      'rxjs/operators',
    ],
    [
      'import',
      {
        libraryDirectory: '_esm5/internal/observable',
        libraryName: 'rxjs',
        camel2DashComponentName: false,
        transformToDefaultImport: false,
      },
      'rxjs',
    ],
  ],
};
