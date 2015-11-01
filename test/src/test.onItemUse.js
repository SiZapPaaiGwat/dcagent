/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
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

  it('should throw an error if init is not invoked', function() {
    expect(onItemUse).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onItemUse'})
    expect(onItemUse).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onItemUse).not.toThrow()
  })

  it('should throw an error since itemNum is less than zero', function() {
    initAndLogin()
    var itemUse = function() {
      DCAgent.onItemUse('大魔棒', -1, '关卡25', '加血加魔')
    }
    expect(itemUse).toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onItemUse()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })
})
