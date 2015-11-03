/*globals ASAP_TIMEOUT, describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine */
describe('onItemBuy', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var onItemBuy = function() {
    DCAgent.onItemBuy('狂战斧', 1, '金币', 4700, '关卡23')
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'onItemBuy'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function() {
    expect(onItemBuy).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onItemBuy'})
    expect(onItemBuy).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onItemBuy).not.toThrow()
  })

  it('should throw an error since coinNum/itemNum is less than zero', function() {
    initAndLogin()
    var itemBuy1 = function() {
      DCAgent.onItemBuy('狂战斧', 1, '金币', -1, '关卡23')
    }
    var itemBuy2 = function() {
      DCAgent.onItemBuy('狂战斧', -1, '金币', 1, '关卡23')
    }
    expect(itemBuy1).toThrow()
    expect(itemBuy2).toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onItemBuy()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })
})
