# Omniface
This template should help get you started developing with OMNIFACE powerd by Vue 3 in Vite and warp code generator.
 
## Project Setup

```sh
git clone https://github.com/yiitron/omniface-vue.git
cd omniface
npm install
```

## NOTE:
### For warp CLI code generator to run you must configure omniface.cfg

## Documentation
To read the documentation for omniface __run__

```sh
npm run docs:dev //open a new terminal in omniface app
```
Access the doc via
```sh
http localhost:3000/docs
http localhost:5174/docs

## Warp CLI Commands

```sh
node warp                // show help menu for warp CLI

node warp module         // show help menu for warp CLI when creating a module
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
