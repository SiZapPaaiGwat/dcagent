/*globals ASAP_TIMEOUT, describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine */
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

  it('should throw an error if init is not invoked', function() {
    expect(onCoinGet).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onCoinGet'})
    expect(onCoinGet).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onCoinGet).not.toThrow()
  })

  it('should throw an error because balanceNum is less than gainNum', function() {
    initAndLogin()
    var coinGet = function() {
      DCAgent.onCoinGet(100, 0, '金币', '完成任务获得奖励')
    }
    expect(coinGet).toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onCoinGet()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })

  describe('coin info', function() {
    it('should be the same with what I set', function() {
      initAndLogin()
      onCoinGet()

      jasmine.clock().tick(ASAP_TIMEOUT)
      var events = DCAgent.report.eventInfoList
      var event = events && events.filter(function(item) {
        return item.eventId === 'DE_EVENT_COIN_ACTION'
      })
      var data = event && event[0] && event[0].eventMap
      expect(data).toBeTruthy()
      expect(data.coinNum).toEqual(100)
      expect(data.balanceNum).toEqual(300)
      expect(data.coinType).toEqual(encodeURIComponent('金币'))
      expect(data.reason).toEqual(encodeURIComponent('完成任务获得奖励'))
    })
  })
})
