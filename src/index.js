import browserslist from 'browserslist'

// convert the browserslist field in package.json to
// esbuild compatible array of browsers
export default function browserslistToEsbuild(browserslistConfig, options = {}) {
  if (!browserslistConfig) {
    // the path from where the script is run
    const path = process.cwd()

    // read config if none is passed
    browserslistConfig = browserslist.loadConfig({ path, ...options })
  }

  const SUPPORTED_ESBUILD_TARGETS = new Set([
    'es',
    'chrome',
    'edge',
    'firefox',
    'ios',
    'node',
    'safari',
    'opera',
    'ie',
  ])

  // https://github.com/eBay/browserslist-config/issues/16#issuecomment-863870093
  const UNSUPPORTED = ['android 4']

  const replaces = {
    ios_saf: 'ios',
    android: 'chrome',
  }

  const separator = ' '

  let listOfBrowsers = browserslist(browserslistConfig, options)
    // filter out the unsupported ones
    .filter(
      (browser) => !UNSUPPORTED.some((unsupportedBrowser) => browser.startsWith(unsupportedBrowser))
    )
    // transform into ['chrome', '88']
    .map((browser) => browser.split(separator))
    // replace the similar browser
    .map(([browserName, version]) => [replaces[browserName] || browserName, version])
    // 11.0-12.0 --> 11.0
    .map(([browserName, version]) => [
      browserName,
      version.includes('-') ? version.slice(0, version.indexOf('-')) : version,
    ])
    // 11.0 --> 11
    .map(([browserName, version]) => [
      browserName,
      version.endsWith('.0') ? version.slice(0, -2) : version,
    ])
    // removes invalid versions that will break esbuild
    // https://github.com/evanw/esbuild/blob/35c0d65b9d4f29a26176404d2890d1b499634e9f/compat-table/src/caniuse.ts#L119-L122
    .filter(([, version]) => /^\d+(\.\d+)*$/.test(version))
    // only get the targets supported by esbuild
    .filter(([browserName]) => SUPPORTED_ESBUILD_TARGETS.has(browserName))

  // only get the oldest version, assuming that the older version is the last one in the array:
  listOfBrowsers = Object.entries(Object.fromEntries(listOfBrowsers))

  return listOfBrowsers.map(([browserName, version]) => `${browserName}${version}`)
}
