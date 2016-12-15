require! 'prelude-ls': { fold, first, map, filter }
require! 'parse-favicon': parse-favicon
require! 'enhanced-notification': { BasicNotification, ImageNotification }

class NavigableNotificationsManager
  add: (options) ->
    notification = do ->
      if options.type === 'basic'
        new BasicNotification options
      else if options.type === 'image'
        new ImageNotification options
      else
        null

    if notification
      notification.create!

module.exports = NavigableNotificationsManager
