const browserslist = require('browserslist')

// convert the browserslist field in package.json to
// esbuild compatible array of browsers
function browserslistToEsbuild(browserslistConfig) {
  if (!browserslistConfig) {
    // the path from where the script is run
    const path = process.cwd()

    // read config if none is passed
    browserslistConfig = browserslist.loadConfig({ path })
  }

  const SUPPORTED_ESBUILD_TARGETS = ['es', 'chrome', 'edge', 'firefox', 'ios', 'node', 'safari']
  const separator = ' '
  return (
    browserslist(browserslistConfig)
      // transform into ['chrome', '88']
      .map((b) => b.split(separator))
      // only get the ones supported by esbuild
      .filter((b) => SUPPORTED_ESBUILD_TARGETS.includes(b[0]))
      // only get the oldest version
      .reduce((acc, b) => {
        const existingIndex = acc.findIndex((br) => br[0] === b[0])

        if (existingIndex !== -1) {
          acc[existingIndex][1] = b[1]
        } else {
          acc.push(b)
        }
        return acc
      }, [])
      // remove separator
      .map((b) => b.join(''))
  )
}

module.exports = browserslistToEsbuild
