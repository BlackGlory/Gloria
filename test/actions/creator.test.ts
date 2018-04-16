import types from '../../src/actions/types'
import * as creator from '../../src/actions/creator'

describe('tasks action creator', () => {
  test('should create add-task', () => {
    expect(creator.addTask({
      name: 'TestName'
    , code: 'TestCode'
    , triggerInterval: 1
    , needInteraction: false
    }))
    .toEqual({
      type: types.addTask
    , name: 'TestName'
    , code: 'TestCode'
    , triggerInterval: 1
    , needInteraction: false
    , triggerCount: 0
    , pushCount: 0
    , isEnable: true
    , origin: ''
    })
  })

  test('should create update-task', () => {
    expect(creator.updateTask('TestId', {
      name: 'TestName'
    , code: 'TestCode'
    }))
    .toEqual({
      type: types.updateTask
    , id: 'TestId'
    , name: 'TestName'
    , code: 'TestCode'
    })
  })
  
  test('should create update-task-by-origin', () => {
    expect(creator.updateTaskByOrigin('TestOrigin', {
      code: 'TestCode'
    }))
    .toEqual({
      type: types.updateTaskByOrigin
    , origin: 'TestOrigin'
    , code: 'TestCode'
    })
  })

  test('should create remove-task', () => {
    expect(creator.removeTask('TestId'))
    .toEqual({
      type: types.removeTask
    , id: 'TestId'
    })
  })

  test('should create remove-task-by-origin', () => {
    expect(creator.removeTaskByOrigin('TestOrigin'))
    .toEqual({
      type: types.removeTaskByOrigin
    , origin: 'TestOrigin'
    })
  })

  test('should create set-trigger-interval', () => {
    expect(creator.setTriggerInterval('TestId', 1))
    .toEqual({
      type: types.setTriggerInterval
    , id: 'TestId'
    , triggerInterval: 1
    })
  })

  test('should create set-need-interaction', () => {
    expect(creator.setNeedInteraction('TestId', false))
    .toEqual({
      type: types.setNeedInteraction
    , id: 'TestId'
    , needInteraction: false
    })
  })

  test('should create set-is-enable', () => {
    expect(creator.setIsEnable('TestId', false))
    .toEqual({
      type: types.setIsEnable
    , id: 'TestId'
    , isEnable: false
    })
  })

  test('should create increase-trigger-count', () => {
    const result = creator.increaseTriggerCount('TestId', false)
    expect(result.type).toEqual(types.increaseTriggerCount)
    expect(result.id).toEqual('TestId')
    expect(result.date).toBeInstanceOf(Date)
  })

  test('should create increase-push-count', () => {
    const result = creator.increasePushCount('TestId', false)
    expect(result.type).toEqual(types.increasePushCount)
    expect(result.id).toEqual('TestId')
    expect(result.date).toBeInstanceOf(Date)
  })

  test('should create clear-all-tasks', () => {
    expect(creator.clearAllTasks())
    .toEqual({ type: types.clearAllTasks })
  })

  test('should create merge-tasks', () => {
    expect(creator.mergeTasks([]))
    .toEqual({ type: types.mergeTasks, newTasks: [] })
  })

  test('should create remove-origin', () => {
    expect(creator.removeOrigin('TestId'))
    .toEqual({ type: types.removeOrigin, id: 'TestId' })
  })
})

describe('notifications action creator', () => {
  test('should create add-notification', () => {
    expect(creator.addNotification({
      title: 'TEST_TITLE'
    , extraArgument: 'SHOULD_REMOVED'
    }))
    .toEqual({
      type: types.addNotification
    , options: {
        type: 'basic'
      , title: 'TEST_TITLE'
      , message: ''
      , contextMessage: undefined
      , imageUrl: undefined
      , iconUrl: creator.DEFAULT_ICON_URL
      , url: undefined
      }
    })
  })

  test('should create clear-all-notifications', () => {
    expect(creator.clearAllNotifications())
    .toEqual({ type: types.clearAllNotifications })
  })

  test('should create merge-notifications', () => {
    expect(creator.mergeNotifications([]))
    .toEqual({
      type: types.mergeNotifications
    , newNotifications: []
    })
  })
})

describe('stages action creator', () => {
  test('should create commit-single-to-stage', () => {
    expect(creator.commitSingleToStage('TestId', {}))
    .toEqual({
      type: types.commitSingleToStage
    , id: 'TestId'
    , nextStage: {}
    })
  })

  test('should create commit-to-stage', () => {
    expect(creator.commitToStage('TestId', []))
    .toEqual({
      type: types.commitToStage
    , id: 'TestId'
    , nextStage: []
    })
  })

  test('should create clear-stage', () => {
    expect(creator.clearStage('TestId'))
    .toEqual({
      type: types.clearStage
    , id: 'TestId'
    })
  })

  test('should create clear-all-stages', () => {
    expect(creator.clearAllStages())
    .toEqual({
      type: types.clearAllStages
    })
  })

  test('should create mark-stage-read', () => {
    expect(creator.markStageRead('TestId'))
    .toEqual({
      type: types.markStageRead
    , id: 'TestId'
    })
  })

  test('should create merge-stages', () => {
    expect(creator.mergeStages([]))
    .toEqual({
      type: types.mergeStages
    , newStages: []
    })
  })
})

describe('configs action creator', () => {
  test('should create set-config', () => {
    expect(creator.setConfig('TestName', 'TestValue'))
    .toEqual({
      type: types.setConfig
    , name: 'TestName'
    , value: 'TestValue'
    })
  })

  test('should create clear-all-configs', () => {
    expect(creator.clearAllConfigs())
    .toEqual({
      type: types.clearAllConfigs
    })
  })
  
  test('should create merge-configs', () => {
    expect(creator.mergeConfigs([]))
    .toEqual({
      type: types.mergeConfigs
    , newConfigs: []
    })
  })
})