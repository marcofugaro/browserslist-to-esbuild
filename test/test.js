import path from 'path'
import { fileURLToPath } from 'url'
import test from 'ava'
import sinon from 'sinon'
import browserslistToEsbuild from '../src/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

test('works by passing browsers as array', (t) => {
  const target = browserslistToEsbuild(['>0.2%', 'not dead', 'not op_mini all'])

  t.deepEqual(target, ['chrome103', 'edge87', 'firefox115', 'ios12.2', 'opera102', 'safari14.1'])
})

test('works by passing browsers as string', (t) => {
  const target = browserslistToEsbuild('last 2 versions')

  t.deepEqual(target, [
    'chrome119',
    'edge119',
    'firefox120',
    'ie10',
    'ios17',
    'opera103',
    'safari17.1',
  ])
})

test('works by loading package.json config', (t) => {
  const packageJsonDir = path.resolve(__dirname, './fixtures/packageJson')

  // makes process.cwd() use that folder
  if (!t.context.cwd) t.context.cwd = sinon.stub(process, 'cwd')
  const cwdStub = t.context.cwd.returns(packageJsonDir)

  process.env.NODE_ENV = 'production'
  t.deepEqual(browserslistToEsbuild(), [
    'chrome103',
    'edge87',
    'firefox115',
    'ios12.2',
    'opera102',
    'safari14.1',
  ])

  process.env.NODE_ENV = 'development'
  t.deepEqual(browserslistToEsbuild(), ['chrome120', 'firefox121', 'safari17.2'])

  cwdStub.restore()
  process.env.NODE_ENV = ''
})

test('works by loading .browserslist config', (t) => {
  const browserslistrcDir = path.resolve(__dirname, './fixtures/browserslistrc')

  // makes process.cwd() use that folder
  if (!t.context.cwd) t.context.cwd = sinon.stub(process, 'cwd')
  const cwdStub = t.context.cwd.returns(browserslistrcDir)

  t.deepEqual(browserslistToEsbuild(), [
    'chrome109',
    'edge119',
    'firefox119',
    'ios16.6',
    'safari16.6',
  ])

  process.env.BROWSERSLIST_ENV = 'ssr'
  t.deepEqual(browserslistToEsbuild(), ['node12.22'])

  cwdStub.restore()
  process.env.BROWSERSLIST_ENV = ''
})

test('the options argument works', (t) => {
  const browserslistrcDir = path.resolve(__dirname, './fixtures/browserslistrc')

  // makes process.cwd() use that folder
  if (!t.context.cwd) t.context.cwd = sinon.stub(process, 'cwd')
  const cwdStub = t.context.cwd.returns(browserslistrcDir)

  t.deepEqual(browserslistToEsbuild(undefined, { env: 'ssr' }), ['node12.22'])

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
