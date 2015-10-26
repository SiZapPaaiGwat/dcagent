describe('DCAgent.init', function() {
  it('should init with an appId', function() {
    DCAgent.init({}).should.be.false()
    DCAgent.init({appId: '123'}).should.be.true()
  })
})
