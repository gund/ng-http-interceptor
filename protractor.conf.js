require('ts-node').register({
  compilerOptions: {
    module: 'commonjs'
  }
});

var path = require('path');

exports.config = {
  baseUrl: 'http://localhost:8080/',

  specs: [
    path.resolve('e2e', '*.e2e.ts')
  ],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['show-fps-counter=true']
    }
  },

  onPrepare: function () {
    browser.ignoreSynchronization = true;
  },

  useAllAngular2AppRoots: true
};
