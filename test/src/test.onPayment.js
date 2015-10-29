/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent */
describe('onPayment', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var payment = function() {
    DCAgent.onPayment({amount: 123})
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'payment'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function(done) {
    expect(payment).toThrow()
    done()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'payment'})
    expect(DCAgent.onPayment).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(payment).not.toThrow()
  })

  it('should throw an error when there is no amount field', function() {
    initAndLogin()
    var pay1 = function() {
      DCAgent.onPayment({amountx: 123})
    }
    var pay2 = function() {
      DCAgent.onPayment()
    }
    expect(pay1).toThrow()
    expect(pay2).toThrow()
  })

  it('should trigger ajax right now', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    DCAgent.onPayment({
      amount: 123
    })
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })

  // 大于等于1e21的数不能正确的传给后台
  it('amount should be less than 1e21', function() {
    initAndLogin()
    var data = DCAgent.onPayment({
      amount: 1e22
    })
    expect(data.currencyAmount).toBeLessThan(1e21)
  })
})
