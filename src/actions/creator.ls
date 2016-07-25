'use strict'

require! './types.ls': types

# tasks

export add-task = ({ name, code, trigger-interval, need-interaction }) ->
  {
    type: types.add-task
    name
    code
    trigger-interval
    need-interaction
    trigger-count: 0
    push-count: 0
    is-enable: true
  }

export edit-task = (id, { name, code }) ->
  { type: types.edit-task, id, name, code }

export remove-task = (id) ->
  { type: types.remove-task, id }

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
