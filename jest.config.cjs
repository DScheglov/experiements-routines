const config = {
  // Tell Jest to run in environment that supports ESM
  testEnvironment: 'node',

  // In ESM mode, you need to tell Jest which extensions to treat as ESM.
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  collectCoverage: true,

  // A transform is needed for TS files so that jest can compile them on the fly
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        // This is critical to have TS-Jest transform TS -> ESM
        useESM: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },

  // If your code imports local files with .js, but they are actually .ts,
  // you can use a moduleNameMapper that strips the .js extension.
  // e.g. import xyz from "./foo.js" -> actually ./foo.ts
  moduleNameMapper: {
    // Explanation:
    // - First capturing group (\\.{1,2}/.*) matches relative path like ./ or ../
    // - Then it matches the final `.js`
    // - Replaces with the same path but without `.js`
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  setupFiles: ['<rootDir>/jest.setup.cjs'],
};

module.exports = config;
