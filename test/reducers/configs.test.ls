require! 'chai': { expect }
require! '../../src/actions/types.ls': types
require! '../../src/reducers/configs.ls': configs

describe 'configs reducer', (...) !->
  it 'should handle initial state', ->
    expect configs undefined, {}
    .to.eql {}

  it 'should handle set-config', ->
    state = configs {}, do
      type: types.set-config
      name: 'TestName'
      value: 'TestValue'

    expect(state['TestName']).to.be.equal('TestValue')

  it 'should handle clear-all-configs', ->
    expect configs { 'TestName': 'TestValue' }, do
      type: types.clear-all-configs
    .to.eql {}
