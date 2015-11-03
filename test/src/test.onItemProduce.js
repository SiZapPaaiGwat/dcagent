/*globals ASAP_TIMEOUT, describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine */
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

  it('should throw an error if init is not invoked', function() {
    expect(onItemProduce).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onItemProduce'})
    expect(onItemProduce).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onItemProduce).not.toThrow()
  })

  it('should throw an error since itemNum is less than zero', function() {
    initAndLogin()
    var itemProduce = function() {
      DCAgent.onItemProduce('不朽盾', -1, '关卡24', '五人打盾')
    }
    expect(itemProduce).toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onItemProduce()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })
})
