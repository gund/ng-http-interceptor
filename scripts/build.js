const fs = require('fs')
const exec = require('child_process').exec

const NGC = `"node_modules/.bin/ngc"`
const TSC = `"node_modules/.bin/tsc"`
const ROLLUP = `"node_modules/.bin/rollup"`
const RIMRAF = `"node_modules/.bin/rimraf"`
const UGLIFYJS = `"node_modules/.bin/uglifyjs"`

const cleanup = `${RIMRAF} dist`
const buildMain = `${NGC} -p tsconfig.es2015.json`
const buildFesmEs2015 = `${ROLLUP} -c rollup.config.js`
const buildFesmEs5 = `${TSC} -p tsconfig.es5.json`
const buildUmd = `${ROLLUP} -c rollup.config.umd.js`
const buildUmdMin = `${UGLIFYJS} -c --screw-ie8 --comments -o dist/bundles/ng-http-interceptor.umd.min.js dist/bundles/ng-http-interceptor.umd.js`
const removeTmpFesmEs5 = `${RIMRAF} dist/bundles/es5`

execP(cleanup)
  .then(() => console.log('Compiling project...'))
  .then(() => execP(buildMain))
  .then(() => console.log('OK.\n\nBuilding FESM ES2015...'))
  .then(() => execP(buildFesmEs2015))
  .then(() => console.log('OK.\n\nBuilding FESM ES5...'))
  .then(() => execP(buildFesmEs5))
  .then(() => moveFesmEs5())
  .then(() => execP(removeTmpFesmEs5))
  .then(() => console.log('OK.\n\nBuilding UMD...'))
  .then(() => execP(buildUmd))
  .then(() => console.log('OK.\n\nMinifiyng UMD...'))
  .then(() => execP(buildUmdMin))
  .then(() => console.log('OK.\n\n'))
  .catch(e => console.error(e))

function moveFesmEs5() {
  fs.renameSync('dist/bundles/es5/ng-http-interceptor.es2015.js', 'dist/bundles/ng-http-interceptor.es5.js')
}

function execP(string) {
  return new Promise((res, rej) => {
    exec(string, (err, stdout) => err ? rej(err) : res(stdout))
  })
}
