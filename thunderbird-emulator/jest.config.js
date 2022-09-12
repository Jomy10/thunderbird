module.exports = {
  preset: 'ts-jest',
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Make calling deprecated APIs throw helpful error messages
  errorOnDeprecated: true,

  moduleFileExtensions: ["js", "ts"],
  moduleDirectories: ["node_modules" ,"src"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
};
