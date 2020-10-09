module.exports = {
  devOptions: {
    port: 9999,
    open: "none",
  },
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-typescript',
  ],
};
