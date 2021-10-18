const path = require('path')
const test = require('ava')
const browserslistToEsbuild = require('../src/index.js')

test('works by passing browsers as array', (t) => {
  const target = browserslistToEsbuild(['>0.2%', 'not dead', 'not op_mini all'])

  t.deepEqual(target, ['chrome79', 'edge92', 'firefox91', 'safari13.1'])
})

test('works by passing browsers as string', (t) => {
  const target = browserslistToEsbuild('last 2 versions')

  t.deepEqual(target, ['chrome93', 'edge93', 'firefox92', 'safari14.1'])
})

test('works by loading package.json config', (t) => {
  const packageJsonDir = path.resolve(__dirname, './fixtures')

  process.chdir(packageJsonDir) // makes process.cwd() go in that folder

  process.env.NODE_ENV = 'production'
  t.deepEqual(browserslistToEsbuild(), ['chrome79', 'edge92', 'firefox91', 'safari13.1'])

  process.env.NODE_ENV = 'development'
  t.deepEqual(browserslistToEsbuild(), ['chrome94', 'firefox93', 'safari15'])
})
