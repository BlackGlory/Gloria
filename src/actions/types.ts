export const tasks = {
  addTask: Symbol('add-task')
, updateTask: Symbol('update-task')
, updateTaskByOrigin: Symbol('update-task-by-origin')
, removeTask: Symbol('remove-task')
, removeTaskByOrigin: Symbol('remove-task-by-origin')
, setTriggerInterval: Symbol('set-trigger-interval')
, setNeedInteraction: Symbol('set-need-interaction')
, setIsEnable: Symbol('set-is-enable')
, increaseTriggerCount: Symbol('increase-trigger-count')
, increasePushCount: Symbol('increase-push-count')
, clearAllTasks: Symbol('clear-all-tasks')
, mergeTasks: Symbol('merge-tasks')
, removeOrigin: Symbol('remove-origin')
}

export const notifications = {
  addNotification: Symbol('add-notification')
, clearAllNotifications: Symbol('clear-all-notifications')
, mergeNotifications: Symbol('merge-notifications')
}

export const stages = {
  commitToStage: Symbol('commit-to-stage')
, commitSingleToStage: Symbol('commit-single-to-stage')
, clearStage: Symbol('clear-stage')
, clearAllStages: Symbol('clear-all-stages')
, markStageRead: Symbol('mark-stage-read')
, mergeStages: Symbol('merge-stages')
}

export const configs = {
  setConfig: Symbol('set-config')
, clearAllConfigs: Symbol('clear-all-configs')
, mergeConfigs: Symbol('merge-configs')
}

export default {
  ...tasks
, ...notifications
, ...stages
, ...configs
}