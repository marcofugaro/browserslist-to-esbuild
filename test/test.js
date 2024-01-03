const path = require('path')
const test = require('ava')
const sinon = require('sinon')
const browserslistToEsbuild = require('../src/index.js')

test('works by passing browsers as array', (t) => {
  const target = browserslistToEsbuild(['>0.2%', 'not dead', 'not op_mini all'])

  t.deepEqual(target, ['chrome103', 'edge87', 'firefox115', 'ios12.2', 'safari14.1'])
})

test('works by passing browsers as string', (t) => {
  const target = browserslistToEsbuild('last 2 versions')

  t.deepEqual(target, ['chrome119', 'edge119', 'firefox120', 'ios17', 'safari17.1'])
})

test('works by loading package.json config', (t) => {
  const packageJsonDir = path.resolve(__dirname, './fixtures')

  // makes process.cwd() use that folder
  const cwdStub = sinon.stub(process, 'cwd').returns(packageJsonDir)

  process.env.NODE_ENV = 'production'
  t.deepEqual(browserslistToEsbuild(), [
    'chrome103',
    'edge87',
    'firefox115',
    'ios12.2',
    'safari14.1',
  ])

  process.env.NODE_ENV = 'development'
  t.deepEqual(browserslistToEsbuild(), ['chrome120', 'firefox121', 'safari17.2'])

  cwdStub.restore()
})

test('works with ios', (t) => {
  const target = browserslistToEsbuild('ios >= 9')

  t.deepEqual(target, ['ios9'])
})

test('works with android and ios', (t) => {
  const target = browserslistToEsbuild('ios >= 11, android >= 5')

  t.deepEqual(target, ['chrome120', 'ios11'])
})

test('no support for android 4', (t) => {
  const target = browserslistToEsbuild('android >= 4')

  t.deepEqual(target, ['chrome120'])
})
