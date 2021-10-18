# browserslist-to-esbuild

> Use [browserslist](https://github.com/browserslist/browserslist) with [esbuild](https://esbuild.github.io/).

Allows you to use use browserslist and pass the correct browsers to esbuild's [target](https://esbuild.github.io/api/#target) option.

## Install

```
npm install --save-dev browserslist-to-esbuild
```

or

```
yarn add --dev browserslist-to-esbuild
```

## Usage

You can call `browserslistToEsbuild()` directly in your `esbuild.mjs` script, it will look for your browserslist config in either `package.json` or the `.browserslistrc`.

It will return an esbuild-compatible array of browsers.

```js
import { build } from 'esbuild'
import browserslistToEsbuild from 'browserslist-to-esbuild'

build({
  entryPoints: ['input.js'],
  outfile: 'output.js',
  bundle: true,
  target: browserslistToEsbuild(), // --> ["chrome79", "edge92", "firefox91", "safari13.1"]
}).catch(() => process.exit(1))
```

Otherwise, you can pass yourself a browserslist array or string to the function.

```js
browserslistToEsbuild(['>0.2%', 'not dead', 'not op_mini all'])
```

## API

### browserslistToEsbuild(browserslistConfig?)

#### browserslistConfig

Type: `array | string | undefined`

An array of string of browsers [compatible with browserslist](https://github.com/browserslist/browserslist#full-list). If none is passed, a browserslist config is searched in the script running directory.
