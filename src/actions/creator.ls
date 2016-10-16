'use strict'

require! './types.ls': types
require! 'prelude-ls': { map }

export const MAX_STRING_LENGTH = 100
export const DEFAULT_ICON_URL = 'assets/images/icon-128.png'

# tasks

export add-task = ({ name, code, trigger-interval, need-interaction, origin = '' }) ->
  {
    type: types.add-task
    name
    code
    trigger-interval
    need-interaction
    trigger-count: 0m
    push-count: 0time
    is-enable: true
    origin
  }

export update-task = (id, { name, code }) ->
  { type: types.update-task, id, name, code }

export update-task-by-origin = (origin, { code }) ->
  { type: types.update-task-by-origin, origin, code }

export remove-task = (id) ->
  { type: types.remove-task, id }

export remove-task-by-origin = (origin) ->
  { type: types.remove-task-by-origin, origin }

export set-trigger-interval = (id, trigger-interval) ->
  { type: types.set-trigger-interval, id, trigger-interval }

export set-need-interaction = (id, need-interaction) ->
  { type: types.set-need-interaction, id, need-interaction }

export set-is-enable = (id, is-enable) ->
  { type: types.set-is-enable, id, is-enable }

export increase-trigger-count = (id) ->
  { type: types.increase-trigger-count, id }

export increase-push-count = (id) ->
  { type: types.increase-push-count, id, date: new Date }

export clear-all-tasks = ->
  { type: types.clear-all-tasks }

export merge-tasks = (new-tasks)->
  { type: types.merge-tasks, new-tasks }

export remove-origin = (id) ->
  { type: types.remove-origin, id }

# notifications

export add-notification = (options) ->
  slim-options =
    type: options.type ? 'basic'
    title: (options.title ? '').substring 0, MAX_STRING_LENGTH
    message: (options.message ? '').substring 0, MAX_STRING_LENGTH
    context-message: options.context-message
    icon-url: options.icon-url ? DEFAULT_ICON_URL
    image-url: options.image-url
    url: options.url
  { type: types.add-notification, options: slim-options }

export clear-all-notifications = ->
  { type: types.clear-all-notifications }

export merge-notifications = (notifications)->
  new-notifications = map ((notification) ->
    options = notification.options
    {
      ...notification
      options:
        type: options.type ? 'basic'
        title: (options.title ? '').substring 0, MAX_STRING_LENGTH
        message: (options.message ? '').substring 0, MAX_STRING_LENGTH
        context-message: options.context-message
        icon-url: options.icon-url ? DEFAULT_ICON_URL
        image-url: options.image-url
        url: options.url
    }
  ), notifications
  { type: types.merge-notifications, new-notifications }

# stages

export commit-to-stage = (id, notifications) ->
  next-stage = map ((options) ->
    {
      id: options.id
      title: (options.title ? '').substring 0, MAX_STRING_LENGTH
      message: (options.message ? '').substring 0, MAX_STRING_LENGTH
      context-message: options.context-message
      icon-url: options.icon-url ? DEFAULT_ICON_URL
      image-url: options.image-url
      url: options.url
    }
  ), notifications
  { type: types.commit-to-stage, id, next-stage }

export commit-single-to-stage = (id, notification) ->
  { type: types.commit-single-to-stage, id, next-stage: notification }

export clear-stage = (id) ->
  { type: types.clear-stage, id }

export clear-all-stages = ->
  { type: types.clear-all-stages }

export mark-stage-read = (id) ->
  { type: types.mark-stage-read, id }

export merge-stages = (stages) ->
  new-stages = map ((stage) ->
    notifications = stage.notification
    {
      ...stage
      stage: map ((notification) ->
        options = notification.options
        {
          ...notification
          options:
            type: options.type ? 'basic'
            id: options.id
            title: (options.title ? '').substring 0, MAX_STRING_LENGTH
            message: (options.message ? '').substring 0, MAX_STRING_LENGTH
            context-message: options.context-message
            icon-url: options.icon-url ? DEFAULT_ICON_URL
            image-url: options.image-url
            url: options.url
        }
      ), notifications
    }
  ), stages
  { type: types.merge-stages, new-stages }

# configs

export set-config = (name, value) ->
  { type: types.set-config, name, value }

export clear-all-configs = ->
  { type: types.clear-all-configs }

export merge-configs = (new-configs)->
  { type: types.merge-configs, new-configs }
