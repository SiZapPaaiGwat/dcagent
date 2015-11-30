/* jshint node: true */
/*globals jasmine*/

var fs = require('fs')
var Jasmine = require('jasmine')
var JasmineCore = require('jasmine-core')
var LocalStorage = require('node-localstorage').LocalStorage

// jasmine-ajax need this
global.getJasmineRequireObj = function() {
  return JasmineCore
}
global.DCAGENT_DEBUG_OPEN = true
global.ASAP_TIMEOUT = 2000
// some test suite failed in ci system(pass in ci's ssh mode)
global.CI_MODE = process.env.CI_MODE
// XMLHttpRequest and localStorage in node
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
global.localStorage = new LocalStorage(__dirname + '/.localstorage')
// jasmine-ajax need this
global.jasmine = new Jasmine({
  jasmineCore: JasmineCore
})
// keep the consistency with browser spec
jasmine.clock = function() {
  return jasmine.env.clock
}
require('jasmine-ajax')

var agentPath = __dirname + '/../dist/dcagent.v2.src'
var specFiles = process.argv[2] ? [process.argv[2]] : fs.readdirSync(__dirname + '/src')

jasmine.clock().install()
// this code must not be removed, other else some specs fail
jasmine.clock().mockDate(new Date(2015, 10, 1))

global.loadDCAgent = function(done) {
  global.DCAgent = require(agentPath)
  done()
}

global.destroyDCAgent = function(done) {
  global.DCAgent.destroy()
  delete require.cache[require.resolve(agentPath)]
  done()
}

jasmine.loadConfig({
  spec_dir: 'src',
  spec_files: specFiles,
  helpers: []
})

jasmine.execute()
