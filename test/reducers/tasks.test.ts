import types from '../../src/actions/types'
import tasks from '../../src/reducers/tasks'

describe('tasks reducer', () => {
  test('should handle initial state', () => {
    expect(tasks(undefined, {})).toEqual([])
  })

  test('should handle add-task', () => {
    const state = tasks([], {
      type: types.addTask,
      name: 'TestName',
      code: 'TestCode',
      triggerInterval: 1,
      needInteraction: false,
      triggerCount: 0,
      pushCount: 0,
      isEnable: true,
      origin: ''
    })
    expect(state.length).toEqual(1)
    expect(state[0]).toBeObject()
    expect(state[0].id).toBeString()
    expect(state[0].name).toEqual('TestName')
    expect(state[0].code).toEqual('TestCode')
    expect(state[0].triggerInterval).toEqual(1)
    expect(state[0].needInteraction).toEqual(false)
    expect(state[0].triggerCount).toEqual(0)
    expect(state[0].pushCount).toEqual(0)
    expect(state[0].isEnable).toEqual(true)
    expect(state[0].origin).toEqual('')
  })
  
  test('should handle update-task', () => {
    expect(
      tasks(
        [{
          id: '1'
        , name: 'NameBefore'
        , code: 'CodeBefore'
        }]
      , {
          type: types.updateTask
        , id: '1'
        , name: 'NameAfter'
        , code: 'CodeAfter'
        }
      )
    )
    .toEqual([{
      id: '1'
    , name: 'NameAfter'
    , code: 'CodeAfter'
    }])
  })

  test('should handle update-task-by-origin', () => {
    expect(
      tasks(
        [{
          id: '1'
        , origin: 'TestOrigin'
        , code: 'CodeBefore'
        }]
      , {
          type: types.updateTaskByOrigin,
          origin: 'TestOrigin',
          code: 'CodeAfter'
        }
      )
    )
    .toEqual([{
      id: '1'
    , origin: 'TestOrigin'
    , code: 'CodeAfter'
    }])
  })

  test('should handle remove-task', () => {
    expect(
      tasks(
        [{
          id: '1'
        }]
      , {
          type: types.removeTask,
          id: '1'
        }
      )
    )
    .toEqual([])
  })

  test('should handle remove-task-by-origin', () => {
    expect(
      tasks(
        [{
          origin: 'TestOrigin'
        }]
      , {
          type: types.removeTaskByOrigin,
          origin: 'TestOrigin'
        }
      )
    )
    .toEqual([])
  })

  test('should handle set-trigger-interval', () => {
    expect(
      tasks(
        [{
          id: '1'
        , triggerInterval: 1
        }]
      , {
          type: types.setTriggerInterval
        , id: '1'
        , triggerInterval: 5
        }
      )
    )
    .toEqual([{
      id: '1'
    , triggerInterval: 5
    }])
  })

  test('should handle set-need-interaction', () => {
    expect(
      tasks(
        [{
          id: '1'
        , needInteraction: false
        }]
      , {
          type: types.setNeedInteraction
        , id: '1'
        , needInteraction: true
        }
      )
    )
    .toEqual([{
      id: '1'
    , needInteraction: true
    }])
  })

  test('should handle set-is-enable', () => {
    expect(
      tasks(
        [{
          id: '1'
        , isEnable: false
        }]
      , {
          type: types.setIsEnable
        , id: '1'
        , isEnable: true
        }
      )
    )
    .toEqual([{
      id: '1'
    , isEnable: true
    }])
  })

  test('should handle increase-trigger-count', () => {
    const date = new Date()
    expect(
      tasks(
        [{
          id: '1'
        , triggerCount: 0
        }]
      , {
          type: types.increaseTriggerCount
        , id: '1'
        , date
        }
      )
    )
    .toEqual([{
      id: '1'
    , triggerCount: 1
    , triggerDate: date
    }])
  })

  test('should handle increase-push-count', () => {
    const date = new Date()
    expect(
      tasks(
        [{
          id: '1'
        , pushCount: 0
        }]
      , {
          type: types.increasePushCount
        , id: '1'
        , date: date
        }
      )
    )
    .toEqual([{
      id: '1'
    , pushCount: 1
    , pushDate: date
    }])
  })

  test('should handle clear-all-tasks', () => {
    expect(tasks([{
      id: '1'
    }], {
      type: types.clearAllTasks
    })).toEqual([])
  })

  test('should handle merge-tasks', () => {
    expect(
      tasks(
        [
          {
            id: '1'
          , name: 'TestName1'
          }
        , {
            id: '2'
          , name: 'TestName2Before'
          }
        ]
      , {
          type: types.mergeTasks
        , newTasks: [
            {
              id: '2'
            , name: 'TestName2After'
            }
          , {
              id: '3'
            , name: 'TestName3'
            }
          ]
        }
      )
    )
    .toEqual([
      {
        id: '1'
      , name: 'TestName1'
      }
    , {
        id: '2'
      , name: 'TestName2After'
      }
    , {
        id: '3'
      , name: 'TestName3'
      }
    ])
  })

  test('should handle remove-origin', () => {
    expect(
      tasks(
        [
          {
            id: '1'
          , origin: 'TestOrigin'
          }
        , {
            id: '2'
          , origin: 'TestOrigin'
          }
        ]
      , {
          type: types.removeOrigin
        , id: '2'
        }
      )
    )
    .toEqual([
      {
        id: '1'
      , origin: 'TestOrigin'
      }
    , {
        id: '2'
      }
    ])
  })
})