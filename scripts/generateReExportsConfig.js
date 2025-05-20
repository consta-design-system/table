module.exports = {
  src: './src',
  distPath: './dist',
  reexports: ['/components'],
  ignore: [
    'src/internal/**',
    'src/**/*.stories/**',
    'src/**/*.stories.*',
    'src/components/ScrollExample/**',
    'src/fileIcons/createFileIcon/**',
    'src/uiKit/**',
    'src/**/__tests__/**',
    'src/**/__stories__/**',
    'src/**/__stand__/**',
    'src/**/__mocks__/**',
    'src/**/__mock__/**',
    'src/**/__docs__/**',
  ],
};
