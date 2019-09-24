module.exports = {
  verbose: true,
  setupFiles: ['./jest.setup.js', './enzyme.setup.js'],
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
      ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "identity-obj-proxy"
    }
};