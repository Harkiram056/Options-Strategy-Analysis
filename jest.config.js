module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/default',
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: [
        '**/__tests__/**/*.spec.(js|jsx)|**/?(*.)+(spec|test).(js|jsx)',
    ],
};
