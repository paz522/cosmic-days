const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      browsers: 'last 2 versions',
      importFrom: './src/css/global.css',
    },
  },
};

export default config;
