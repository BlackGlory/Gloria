'use strict'

const tasks =
  add-task: Symbol!
  edit-task: Symbol!
  remove-task: Symbol!
  set-trigger-interval: Symbol!
  set-can-notice-repeatly: Symbol!
  set-is-enable: Symbol!
  increase-trigger-count: Symbol!
  increase-push-count: Symbol!

const notifications =
  add-notification: Symbol!

const types = {
  ...tasks
  ...notifications
}

module.exports = types
