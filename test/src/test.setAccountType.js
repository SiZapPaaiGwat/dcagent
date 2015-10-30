/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('setAccountType', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var setAccountType = function() {
    DCAgent.setAccountType('guest')
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'setAccountType'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function(done) {
    expect(setAccountType).toThrow()
    done()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'setAccountType'})
    expect(setAccountType).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(setAccountType).not.toThrow()
  })

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    setAccountType()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, 5000)
  })

  it('should be the same with what I set', function(done) {
    initAndLogin()
    DCAgent.setAccountType('VIP')
    setTimeout(function() {
      var headerInfo = DCAgent.report.headerInfo
      expect(headerInfo.accountType).toEqual('VIP')
      done()
    }, 5000)
  })
})
