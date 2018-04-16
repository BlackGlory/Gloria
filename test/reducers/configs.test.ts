import types from '../../src/actions/types'
import configs from '../../src/reducers/configs'

describe('configs reducer', () => {
  test('should handle initial state', () => {
    expect(configs(undefined, {})).toEqual({})
  })

  test('should handle set-config', () => {
    const state = configs({}, {
      type: types.setConfig,
      name: 'TestName',
      value: 'TestValue'
    })
    expect(state['TestName']).toEqual('TestValue')
  })

  test('should handle clear-all-configs', () => {
    expect(
      configs(
        { 'TestName': 'TestValue' }
      , { type: types.clearAllConfigs }
      )
    )
    .toEqual({})
  })

  test('should handle merge-configs', () => {
    expect(
      configs(
        {
          key1: 'value1'
        , key2: 'value2'
        }
      , {
          type: types.mergeConfigs
        , newConfigs: {
            key2: 'value3'
          , key3: 'value4'
          }
        }
      )
    )
    .toEqual({
      key1: 'value1'
    , key2: 'value3'
    , key3: 'value4'
    })
  })
})