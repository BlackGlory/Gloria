'use strict'

const tasks =
  add-task: Symbol!
  edit-task: Symbol!
  remove-task: Symbol!
  set-trigger-interval: Symbol!
  set-need-interaction: Symbol!
  set-is-enable: Symbol!
  increase-trigger-count: Symbol!
  increase-push-count: Symbol!
  clear-all-tasks: Symbol!

const notifications =
  add-notification: Symbol!
  clear-all-notifications: Symbol!

const types = {
  ...tasks
  ...notifications
}

module.exports = types
