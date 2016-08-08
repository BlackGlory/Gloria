'use strict'

const tasks =
  add-task: Symbol \add-task
  edit-task: Symbol \edit-task
  remove-task: Symbol \remove-task
  remove-task-by-origin: Symbol \remove-task-by-origin
  set-trigger-interval: Symbol \set-trigger-interval
  set-need-interaction: Symbol \set-need-interaction
  set-is-enable: Symbol \set-is-enable
  increase-trigger-count: Symbol \increase-trigger-count
  increase-push-count: Symbol \increase-push-count
  clear-all-tasks: Symbol \clear-all-tasks

const notifications =
  add-notification: Symbol \add-notification
  clear-all-notifications: Symbol \clear-all-notifications

const stages =
  commit-to-stage: Symbol \commit-to-stage
  clear-stage: Symbol \clear-stage
  clear-all-stages: Symbol \clear-all-stages
  mark-stage-read: Symbol \mark-stage-read

const types = {
  ...tasks
  ...notifications
  ...stages
}

module.exports = types
