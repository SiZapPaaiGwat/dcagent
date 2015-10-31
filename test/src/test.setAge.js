/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('setAge', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var setAge = function() {
    DCAgent.setAge(29)
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'setAge'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function(done) {
    expect(setAge).toThrow()
    done()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'setAge'})
    expect(setAge).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(setAge).not.toThrow()
  })

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    setAge()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, ASAP_TIMEOUT)
  })

  it('should be the same with what I set', function(done) {
    initAndLogin()
    DCAgent.setAge(100)
    setTimeout(function() {
      var headerInfo = DCAgent.report.headerInfo
      expect(headerInfo.age).toEqual(100)
      done()
    }, ASAP_TIMEOUT)
  })
})
