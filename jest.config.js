module.exports = {
  verbose: true,
  setupFiles: ['./jest.setup.js', './enzyme.setup.js'],
  moduleFileExtensions: ['js', 'jsx','json'],
  moduleNameMapper: {
	    "\\.(css|jpg|png)$": "<rootDir>/test/empty-module.js"
	  }
};