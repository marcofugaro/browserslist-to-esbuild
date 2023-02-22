const path = require('path')
const test = require('ava')
const browserslistToEsbuild = require('../src/index.js')

test('works by passing browsers as array', (t) => {
  const target = browserslistToEsbuild(['>0.2%', 'not dead', 'not op_mini all'])

  t.deepEqual(target, [
    'chrome79',
    'edge92',
    'firefox91',
    'ie11',
    'ios12.2',
    'opera78',
    'safari13.1',
  ])
})

test('works by passing browsers as string', (t) => {
  const target = browserslistToEsbuild('last 2 versions')

  t.deepEqual(target, [
    'chrome87',
    'edge93',
    'firefox92',
    'ie10',
    'ios14.5',
    'opera79',
    'safari14.1',
  ])
})

test('works by loading package.json config', (t) => {
  const packageJsonDir = path.resolve(__dirname, './fixtures')

  process.chdir(packageJsonDir) // makes process.cwd() go in that folder

  process.env.NODE_ENV = 'production'
  t.deepEqual(browserslistToEsbuild(), [
    'chrome79',
    'edge92',
    'firefox91',
    'ie11',
    'ios12.2',
    'opera78',
    'safari13.1',
  ])

  process.env.NODE_ENV = 'development'
  t.deepEqual(browserslistToEsbuild(), ['chrome94', 'firefox93', 'safari15'])
})

test('works with ios', (t) => {
  const target = browserslistToEsbuild('ios >= 9')

  t.deepEqual(target, ['ios9'])
})

test('works with android and ios', (t) => {
  const target = browserslistToEsbuild('ios >= 11, android >= 5')

  t.deepEqual(target, ['chrome94', 'ios11'])
})

test('no support for android 4', (t) => {
  const target = browserslistToEsbuild('android >= 4')

  t.deepEqual(target, ['chrome94'])
})
