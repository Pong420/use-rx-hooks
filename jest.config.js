module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './src/__test__/',
  setupFilesAfterEnv: ['./jest.setup.js']
};
