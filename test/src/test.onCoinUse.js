/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('onCoinUse', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var onCoinUse = function() {
    DCAgent.onCoinUse(200, 100, '金币', '增加体力消耗')
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'onCoinUse'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function(done) {
    expect(onCoinUse).toThrow()
    done()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onCoinUse'})
    expect(onCoinUse).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onCoinUse).not.toThrow()
  })

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onCoinUse()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, 5000)
  })
})
