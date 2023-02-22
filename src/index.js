const browserslist = require('browserslist')
/*
 * Values taken from https://en.wikipedia.org/wiki/Samsung_Internet#History
 * and cross-referenced with https://browsersl.ist/#q=samsung+%3E+0 to get all
 * samsung versions returned by browserslist.
 *
 * Not perfect by any means, but better than no samsung internet support at all.
 *
 * May be worth requesting a Samsung Internet target in esbuild, since Samsung Internet
 * seems to be diverging from Chromium in terms of features, so this mapping isn't
 * 100% accurate after a certain point.
 */
const samsungVersionMap = new Map([
  ['4', '44'],
  ['5.0-5.4', '51'],
  ['6.2-6.4', '56'],
  ['7.2-7.4', '59'],
  ['8.2', '63'],
  ['9.2', '67'],
  ['10.1', '71'],
  ['11.1-11.2', '75'],
  ['12.0', '79'],
  ['13.0', '83'],
  ['14.0', '87'],
  ['15.0', '90'],
  ['16.0', '92'],
  ['17.0', '96'],
  ['18.0', '99'],
  ['19.0', '102'],
  ['20.0', '106'],
])

// convert the browserslist field in package.json to
// esbuild compatible array of browsers
function browserslistToEsbuild(browserslistConfig) {
  if (!browserslistConfig) {
    // the path from where the script is run
    const path = process.cwd()

    // read config if none is passed
    browserslistConfig = browserslist.loadConfig({ path })
  }

  const SUPPORTED_ESBUILD_TARGETS = [
    'es',
    'chrome',
    'edge',
    'firefox',
    'ios',
    'node',
    'safari',
    'opera',
    'ie',
  ]

  // https://github.com/eBay/browserslist-config/issues/16#issuecomment-863870093
  const UNSUPPORTED = ['android 4']

  const replaces = {
    ios_saf: 'ios',
    android: 'chrome',
  }

  const separator = ' '

  return (
    browserslist(browserslistConfig)
      // filter out the unsupported ones
      .filter((b) => !UNSUPPORTED.some((u) => b.startsWith(u)))
      // transform into ['chrome', '88']
      .map((b) => b.split(separator))
      // replace the similar browser
      .map((b) => {
        if (replaces[b[0]]) {
          b[0] = replaces[b[0]]
        }

        if (b[0] === 'samsung') {
          b[0] = 'chrome'
          b[1] = samsungVersionMap.get(b[1])
        }

        return b
      })
      // 11.0-12.0 --> 11.0
      .map((b) => {
        if (b[1].includes('-')) {
          b[1] = b[1].slice(0, b[1].indexOf('-'))
        }

        return b
      })
      // 11.0 --> 11
      .map((b) => {
        if (b[1].endsWith('.0')) {
          b[1] = b[1].slice(0, -2)
        }

        return b
      })
      // only get the ones supported by esbuild
      .filter((b) => SUPPORTED_ESBUILD_TARGETS.includes(b[0]))
      // only get the oldest version
      .reduce((acc, b) => {
        const existingIndex = acc.findIndex((br) => br[0] === b[0])

        if (existingIndex === -1) {
          acc.push(b)
          return acc
        }

        if (Number.parseFloat(acc[existingIndex][1]) > Number.parseFloat(b[1])) {
          acc[existingIndex][1] = b[1]
        }

        return acc
      }, [])
      // remove separator
      .map((b) => b.join(''))
  )
}

module.exports = browserslistToEsbuild
