"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Sync object
const config = {
    verbose: true,
    moduleFileExtensions: ["js", 'ts', "json"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.jsx?$": "babel-jest",
    },
    testEnvironment: "node",
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map