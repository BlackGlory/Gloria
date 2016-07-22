'use strict'

require! './types.ls': types

export add-task = ({ name, code, trigger-interval, can-notice-repeatedly }) ->
  {
    type: types.add-task
    name
    code
    trigger-interval
    can-notice-repeatedly
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

export set-can-notice-repeatly = (id, can-notice-repeatedly) ->
  { type: types.set-can-notice-repeatly, id, can-notice-repeatedly }

export set-is-enable = (id, is-enable) ->
  { type: types.set-is-enable, id, is-enable }

export increase-trigger-count = (id) ->
  { type: types.increase-trigger-count, id }

export increase-push-count = (id) ->
  { type: types.increase-push-count, id }
