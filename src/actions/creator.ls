'use strict'

require! './types.ls': types

export add-task = ({ name, code, trigger-interval, can-notice-repeatedly }) ->
  { type: types.add-task, name, code, trigger-interval, can-notice-repeatedly }

export edit-task = (id, { name, code }) ->
  { type: types.edit-task, name, code }

export remove-task = (id) ->
  { type: types.remove-task, id }

export set-trigger-interval = (id, trigger-interval) ->
  { type: types.set-trigger-interva, id, trigger-interval }

export set-can-notice-repeatly = (id, can-notice-repeatedly) ->
  { type: types.set-is-notice-repeatl, id, can-notice-repeatedly }
