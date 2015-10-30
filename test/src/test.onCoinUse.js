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

  it('should throw an error because useNum is less than zero', function() {
    initAndLogin()
    var coinUse = function() {
      DCAgent.onCoinUse(-1, 0, '金币', '增加体力消耗')
    }
    expect(coinUse).toThrow()
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

  describe('coin info', function() {
    it('should be the same with what I set', function(done) {
      initAndLogin()
      onCoinUse()
      setTimeout(function() {
        var events = DCAgent.report.eventInfoList
        var event = events && events.filter(function(item) {
          return item.eventId === 'DE_EVENT_COIN_ACTION'
        })
        var data = event && event[0] && event[0].eventMap
        expect(data).toBeTruthy()
        expect(data.coinNum).toEqual(200)
        expect(data.balanceNum).toEqual(100)
        expect(data.coinType).toEqual(encodeURIComponent('金币'))
        expect(data.reason).toEqual(encodeURIComponent('增加体力消耗'))
        done()
      }, 5000)
    })
  })
})
