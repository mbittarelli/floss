# Floss

Unit-testing for those hard to reach places.

[![Build Status](https://travis-ci.org/jiborobot/floss.svg?branch=master)](https://travis-ci.org/jiborobot/floss) [![npm version](https://badge.fury.io/js/floss.svg)](https://badge.fury.io/js/floss)

Uses Electron to provide a Mocha unit-testing environment which can be run headlessly or to debugged with DevTools. This was largely inspired by the [electron-mocha](https://github.com/jprichardson/electron-mocha) and [mocha-electron](https://github.com/tscanlin/mochatron) projects but didn't quite have the debugging features needed to develop tests.

## Installation

Install globally:

```bash
npm install -g floss electron-prebuilt
```

Install locally within a project:

```bash
npm install floss electron-prebuild --save-dev
```

## Gulp Usage

```js
const floss = require('floss');
gulp.task('test', function(done) {
    floss('test/index.js', done); 
});
```

### Debug Mode

Open tests in an Electron window where test can can be debugged with `debugger` and dev tools.

```js
const floss = require('floss');
gulp.task('test', function(done) {
    floss({
        path: 'test/index.js',
        debug: true
    }, done);
});
```

### Additional Options

Additional properties can be passed to the test code by adding more values to the run options.

```js
const floss = require('floss');
gulp.task('test', function(done) {
    floss({
        path: 'test/index.js',
        customUrl: 'http://localhost:8080' // <- custom
    }, done);
});
```

The test code and use the global `options` property to have access to the run options.

```js
console.log(options.customUrl); // logs: http://localhost:8080
```

## Command Line Usage

Command Line usage when installed globally:

```bash
floss --path test/index.js
```

Or installed locally:

```bash
node node_modules/.bin/floss --path test/index.js
```

Alernatively, within the **package.json**'s' scripts:

```json
{
    "scripts": {
        "test": "floss --path test/index.js"
    }
}
```

### Debug Mode

Open tests in an Electron window where test can can be debugged with `debugger` and dev tools.

```bash
floss --path test/index.js --debug
```

## Custom Electron Version

Some application may require a specific version of Electron. Floss uses Electron 1.0.0+, but you can specific the path to your own version. The custom version can be used either through the commandline argument `--electron`, by setting the Node environmental variable `ELECTRON_PATH` or by setting the run option `electron`.

```js
gulp.task('test', function(done) {
    floss({
        path: 'test/index.js',
        electron: require('electron-prebuilt')
    }, done);
});
```
```bash
floss --path test/index.js \
	--electron /usr/local/bin/electron
```

```bash
ELECTRON_PATH=/usr/local/bin/electron floss --path test/index.js
```

## Travis Integration

Floss can be used with [Travis CI](https://travis-ci.org/) to run Electron headlessly by utilizing Xvfb. Here's a sample of how to setup this project.

### package.json

Note that scripts `test` must be setup in your **package.json**;

```json
{
    "scripts": {
        "test": "gulp test"
    }
}
```

### .travis.yml

```yml
language: node_js
node_js:
    - "4"

install:
    - npm install xvfb-maybe
    - npm install

before_script:
  - export DISPLAY=':99.0'
  - Xvfb :99 -screen 0 1024x768x24 -extension RANDR &

script:
    - xvfb-maybe npm test
```
