/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('onCoinGet', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var onCoinGet = function() {
    DCAgent.onCoinGet(100, 300, '金币', '完成任务获得奖励')
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'onCoinGet'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function(done) {
    expect(onCoinGet).toThrow()
    done()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onCoinGet'})
    expect(onCoinGet).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onCoinGet).not.toThrow()
  })

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onCoinGet()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, 5000)
  })
})
