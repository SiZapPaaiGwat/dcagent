describe('DCAgent.init', function() {
  it('should init with an appId', function() {
    DCAgent.init()
    DCAgent.isReady().should.be.false()
    DCAgent.init({appId: 'abc'})
    DCAgent.isReady().should.be.true()
  })
})
