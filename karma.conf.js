// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  var harmony_flags = '--js-flags="' + [
    '--harmony-arrow-functions',
    '--harmony-classes',
    '--harmony-computed-property-names',
    '--harmony-spreadcalls',
  ].join(' ') + '"';

  var configuration = {
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-remap-istanbul'),
      require('karma-sourcemap-loader'),
      require('karma-webpack')
    ],
    webpack: require('./webpack.config.js'),
    webpackMiddleware: {
      noInfo: true, // Hide webpack output because its noisy.
      stats: { // Also prevent chunk and module display output, cleaner look. Only emit errors.
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    },
    files: [
      { pattern: './src/test.ts', watched: false }
    ],
    preprocessors: {
      './src/test.ts': ['webpack', 'sourcemap']
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    remapIstanbulReporter: {
      reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov',
        json: './coverage/coverage.json'
      },
      remapOptions: {
        exclude: /(test|polyfills|rxjs).ts$/
      }
    },
    reporters: ['progress', 'karma-remap-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['DebuggableChrome'],
    singleRun: false,

    // browser for travis-ci
    customLaunchers: {
      DebuggableChrome: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9222']
      },
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox', harmony_flags]
      }
    }
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
