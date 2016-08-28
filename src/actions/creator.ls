'use strict'

require! './types.ls': types

# tasks

export add-task = ({ name, code, trigger-interval, need-interaction, origin = '' }) ->
  {
    type: types.add-task
    name
    code
    trigger-interval
    need-interaction
    trigger-count: 0
    push-count: 0
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
  { type: types.increase-push-count, id }

export clear-all-tasks = ->
  { type: types.clear-all-tasks }

export merge-tasks = (new-tasks)->
  { type: types.merge-tasks, new-tasks }

export remove-origin = (id) ->
  { type: types.remove-origin, id }

# notifications

export add-notification = (options) ->
  { type: types.add-notification, options }

export clear-all-notifications = ->
  { type: types.clear-all-notifications }

# stages

export commit-to-stage = (id, next-stage) ->
  { type: types.commit-to-stage, id, next-stage }

export clear-stage = (id) ->
  { type: types.clear-stage, id }

export clear-all-stages = ->
  { type: types.clear-all-stages }

export mark-stage-read = (id) ->
  { type: types.mark-stage-read, id }

# config

export set-config = (name, value) ->
  { type: types.set-config, name, value }

export clear-all-configs = ->
  { type: types.clear-all-configs }
