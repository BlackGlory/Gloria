require! 'chai': { expect }
require! '../../src/actions/types.ls': types
require! '../../src/reducers/notifications.ls': notifications

describe 'notifications reducer', (...) !->
  it 'should handle initial state', ->
    expect notifications undefined, {}
    .to.eql []

  it 'should handle add-notification', ->
    state = notifications [{ options: { message: i } } for i in [1 to 100]], do
      type: types.add-notification
      options: { message: 'test' }

    expect(state.length).to.be.equal(100)
    expect(state[0]).to.be.an('object')
    expect(state[0].id).to.be.an('string')
    expect(state[0].options).to.eql { message: 'test' }
    expect(state[1].options).to.eql { message: 1 }
    expect(state[99].options).to.eql { message: 99 }
    expect(state[100]).to.equal undefined

  it 'should handle clear-all-notifications', ->
    expect notifications [{ options: 'test' }], do
      type: types.clear-all-notifications
    .to.eql []
