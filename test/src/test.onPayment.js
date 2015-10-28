/*globals describe, it, expect, DCAgent, setTimeout*/
describe('DCAgent.onPayment()', function() {
  it('should throw an error if user is not logged in', function() {
    expect(DCAgent.onPayment).toThrow()
    DCAgent.init({appId: 'payment'})
    expect(DCAgent.onPayment).toThrow()
  })

  it('should throw an error when there is no argument', function() {
    DCAgent.login('simon')
    expect(DCAgent.onPayment).toThrow()
  })

  it('should throw an error when there is no amount field', function() {
    DCAgent.login('simon')
    var payment = function() {
      DCAgent.onPayment({})
    }
    expect(payment).toThrow()
  })

  it('should work when amount is supplied', function() {
    DCAgent.login('simon')
    var payment = function() {
      DCAgent.onPayment({
        amount: 123
      })
    }
    expect(payment).not.toThrow()
  })

  it('should trigger ajax right now', function() {
    var count = DCAgent.player.reportCount
    DCAgent.onPayment({
      amount: 123
    })
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })

  describe('amount check', function() {
    // 大于等于1e21的数不能正确的传给后台
    it('should be less than 1e21', function() {
      var data = DCAgent.onPayment({
        amount: 1e22
      })
      expect(data.currencyAmount).toBeLessThan(1e21)
    })
  })
})
