/*globals describe, it, expect, DCAgent*/
describe('DCAgent.init', function() {
  it('should init with an appId', function() {
    expect(DCAgent.init).toThrow()

    var init = function() {
      DCAgent.init({appId: ''})
    }
    expect(init).toThrow()

    init = function() {
      DCAgent.init({appId: 'abc'})
    }

    expect(init).not.toThrow()

    expect(DCAgent.isReady()).toBe(true)
  })
})
