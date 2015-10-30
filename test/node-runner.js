/* jshint node: true */
var Jasmine = require('jasmine')
var fs = require('fs')
var jasmine = new Jasmine()
var agentPath = '../dist/dcagent.v2.src'
var specFiles = fs.readdirSync('src').filter((i) => {
  // TODO jsamine-ajax works only in browser
  return i !== 'test.rateLimit.js'
})

global.DCAGENT_DEBUG_OPEN = true
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

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
