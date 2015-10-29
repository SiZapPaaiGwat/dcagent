/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('onItemUse', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var onItemUse = function() {
    DCAgent.onItemUse('大魔棒', 17, '关卡25', '加血加魔')
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'onItemUse'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function(done) {
    expect(onItemUse).toThrow()
    done()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onItemUse'})
    expect(onItemUse).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onItemUse).not.toThrow()
  })

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onItemUse()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, 5000)
  })
})
