# Wordly

A small word game project that emphasises the proper way to structure, test, and deploy a project containing multiple end-points and dependencies


### Apps and Packages

- `word-game`: front end of the word game
- `socketServer`: backend of the word game with support for realtime websockets
- `shared`: a utility library shared between front and back end to ensure game logic works in both online and offline
- `config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo
### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting

## Setup

yarn install to install dependencies required by each app/package

### Build

To build all apps and packages, run the following command:
requirements: nodejs version 16 or more, yarn v2/v3

```
cd wordly
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd wordly
yarn run dev
```
## Technologies

Main technologies used throughout the project: 

- [Pipelines](https://turborepo.org/docs/features/pipelines)
- [VueJs](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [SocketIO](https://socket.io/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
