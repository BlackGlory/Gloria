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

  it 'should handle merge-configs', ->
    expect configs {
      key1: 'value1'
      key2: 'value2'
    }, do
      type: types.merge-configs
      new-configs: {
        key2: 'value3'
        key3: 'value4'
      }
    .to.eql {
      key1: 'value1'
      key2: 'value3'
      key3: 'value4'
    }
