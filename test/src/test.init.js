/*globals describe, it, expect, DCAgent*/
describe('DCAgent.init()', function() {
  it('should throw an error when appId is empty', function() {
    expect(DCAgent.init).toThrow()

    var init = function() {
      DCAgent.init({appId: ''})
    }
    expect(init).toThrow()
  })

  it('should work when appId is supplied', function() {
    var init = function() {
      DCAgent.init({appId: 'abc'})
    }

    expect(init).not.toThrow()
    expect(DCAgent.isReady()).toBe(true)
  })
})
