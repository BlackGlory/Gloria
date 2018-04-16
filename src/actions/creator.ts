import types, { notifications } from './types'

export const MAX_STRING_LENGTH = 100
export const DEFAULT_ICON_URL = 'assets/images/icon-128.png'

// tasks

export const addTask = (options: any) => ({
  type: types.addTask
, name: options.name
, code: options.code
, triggerInterval: options.triggerInterval
, needInteraction: options.needInteraction
, triggerCount: 0 // minutes
, pushCount: 0 // times
, isEnable: true
, origin: options.origin || ''
})

export const updateTask = (id: string, options: any) => ({
  type: types.updateTask
, id
, name: options.name
, code: options.code
})

export const updateTaskByOrigin = (origin: string, options: any) => ({
  type: types.updateTaskByOrigin
, origin
, code: options.code
})

export const removeTask = (id: string) => ({
  type: types.removeTask
, id
})

export const removeTaskByOrigin = (origin: string) => ({
  type: types.removeTaskByOrigin
, origin
})

export const setTriggerInterval = (id: string, triggerInterval: number) => ({
  type: types.setTriggerInterval
, id
, triggerInterval
})

export const setNeedInteraction = (id: string, needInteraction: boolean) => ({
  type: types.setNeedInteraction
, id
, needInteraction
})

export const setIsEnable = (id: string, isEnable: boolean) => ({
  type: types.setIsEnable
, id
, isEnable
})

export const increaseTriggerCount = (id: string) => ({
  type: types.increaseTriggerCount
, id
, date: new Date()
})

export const increasePushCount = (id: string) => ({
  type: types.increasePushCount
, id
, date: new Date()
})

export const clearAllTasks = () => ({
  type: types.clearAllTasks
})

export const mergeTasks = (newTasks: any[]) => ({
  type: types.mergeTasks
, newTasks
})

export const removeOrigin = (id: string) => ({
  type: types.removeOrigin
, id
})

// notifications

export const addNotification = (options: any) => {
  const slimOptions = {
    type: options.type || 'basic'
  , title: (options.title || '').substring(0, MAX_STRING_LENGTH)
  , message: (options.message || '').substring(0, MAX_STRING_LENGTH)
  , contextMessage: options.contextMessage
  , iconUrl: options.iconUrl || DEFAULT_ICON_URL
  , imageUrl: options.imageUrl
  , url: options.url
  }

  return {
    type: types.addNotification
  , options: slimOptions
  }
}

export const clearAllNotifications = () => ({
  type: types.clearAllNotifications
})

export const mergeNotifications = (notifications: any[]) => {
  const newNotifications = notifications.map(notification => {
    const options = notification.options
    
    return {
      ...notification
    , options: {
        type: options.type || 'basic'
      , title: (options.title || '').substring(0, MAX_STRING_LENGTH)
      , message: (options.message || '').substring(0, MAX_STRING_LENGTH)
      , contextMessage: options.contextMessage
      , iconUrl: options.iconUrl || DEFAULT_ICON_URL
      , imageUrl: options.imageUrl
      , url: options.url
      }
    }
  })

  return {
    type: types.mergeNotifications
  , newNotifications
  }
}

// stages

export const commitToStage = (id: string, notifications: any[]) => {
  const nextStage = notifications.map(options => ({
    id: options.id
  , title: (options.title || '').substring(0, MAX_STRING_LENGTH)
  , message: (options.message || '').substring(0, MAX_STRING_LENGTH)
  , contextMessage: options.contextMessage
  , iconUrl: options.iconUrl || DEFAULT_ICON_URL
  , imageUrl: options.imageUrl
  , url: options.url
  }))

  return {
    type: types.commitToStage
  , id
  , nextStage
  }
}

export const commitSingleToStage = (id: string, notification: any) => ({
  type: types.commitSingleToStage
, id
, nextStage: notification
})

export const clearStage = (id: string) => ({
  type: types.clearStage
, id
})

export const clearAllStages = () => ({
  type: types.clearAllStages
})

export const markStageRead = (id: string) => ({
  type: types.markStageRead
, id
})

export const mergeStages = (stages: any[]) => {
  const newStages = stages.map(container => ({
    ...container
  , stage: container.stage.map((options: any) => ({
      type: options.type || 'basic'
    , id: options.id
    , title: (options.title || '').substring(0, MAX_STRING_LENGTH)
    , message: (options.message || '').substring(0, MAX_STRING_LENGTH)
    , contextMessage: options.contextMessage
    , iconUrl: options.iconUrl || DEFAULT_ICON_URL
    , imageUrl: options.imageUrl
    , url: options.url
    }))
  }))

  return {
    type: types.mergeStages
  , newStages
  }
}

// configs

export const setConfig = (name: string, value: any) => ({
  type: types.setConfig
, name
, value
})

export const clearAllConfigs = () => ({
  type: types.clearAllConfigs
})

export const mergeConfigs = (newConfigs: any[]) => ({
  type: types.mergeConfigs
, newConfigs
})