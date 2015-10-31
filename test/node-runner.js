/* jshint node: true */

var fs = require('fs')
var Jasmine = require('jasmine')
var JasmineCore = require('jasmine-core')
var LocalStorage = require('node-localstorage').LocalStorage

// jasmine-ajax need this global varaible
global.getJasmineRequireObj = function() {
  return JasmineCore
}
global.DCAGENT_DEBUG_OPEN = true
global.ASAP_TIMEOUT = 2010
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
global.localStorage = new LocalStorage('./.localstorage')

// for jasmine-ajax
global.jasmine = new Jasmine({
  jasmineCore: JasmineCore
})
jasmine.clock = function() {
  return jasmine.env.clock
}
require('jasmine-ajax')

var agentPath = '../dist/dcagent.v2.src'
var specFiles = fs.readdirSync('src')

global.loadDCAgent = function(done) {
  jasmine.clock().install()
  // TODO why we need mock a date
  jasmine.clock().mockDate(new Date(2015, 11, 1))
  global.DCAgent = require(agentPath)
  done()
}

global.destroyDCAgent = function(done) {
  global.DCAgent.destroy()
  delete require.cache[require.resolve(agentPath)]
  jasmine.clock().uninstall()
  done()
}

jasmine.loadConfig({
  spec_dir: 'src',
  spec_files: specFiles,
  helpers: []
})

jasmine.execute()
