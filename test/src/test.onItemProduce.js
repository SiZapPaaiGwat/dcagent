/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('onItemProduce', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var onItemProduce = function() {
    DCAgent.onItemProduce('不朽盾', 1, '关卡24', '五人打盾')
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'onItemProduce'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function(done) {
    expect(onItemProduce).toThrow()
    done()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onItemProduce'})
    expect(onItemProduce).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onItemProduce).not.toThrow()
  })

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onItemProduce()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, 5000)
  })
})
