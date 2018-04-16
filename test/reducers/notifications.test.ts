import types from '../../src/actions/types'
import notifications from '../../src/reducers/notifications'
import { range } from '../helpers'

describe('notifications reducer', () => {
  test('should handle initial state', () => {
    expect(notifications(undefined, {})).toEqual([])
  })

  test('should handle add-notification', () => {
    const state = notifications([...range(1, 200)].map(i => ({ options: { message: i }})), {
      type: types.addNotification,
      options: {
          message: 'test'
      }
    })

    expect(state.length).toEqual(200)
    expect(state[0]).toBeObject()
    expect(state[0].id).toBeString()
    expect(state[0].options).toEqual({
      message: 'test'
    })
    expect(state[1].options).toEqual({
      message: 1
    })
    expect(state[199].options).toEqual({
      message: 199
    })
    expect(state[200]).toBeUndefined()
  })

  test('should handle clear-all-notifications', () => {
    expect(
      notifications(
        [
          { options: 'test' }
        ]
      , {
          type: types.clearAllNotifications
        }
      )
    )
    .toEqual([])
  })

  test('should handle merge-notifications', () => {
    expect(
      notifications(
        [
          {
            id: '1'
          , options: ['Test1']
          }
        , {
            id: '2'
          , options: ['Test2']
          }
        ]
      , {
          type: types.mergeNotifications
        , newNotifications: [
            {
              id: '2'
            , options: ['Test3']
            }
          , {
              id: '3'
            , options: ['Test4']
            }
          ]
        }
      )
    ).toEqual([
      {
        id: '1'
      , options: ['Test1']
      }
    , {
        id: '2'
      , options: ['Test3']
      }
    , {
        id: '3'
      , options: ['Test4']
      }
    ])
  })
})