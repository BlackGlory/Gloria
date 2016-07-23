'use strict'

require! 'node-uuid': uuid
require! '../actions/types.ls': types

const actions-map =
  (types.add-notification): (state, options) ->
    [...state, { id: uuid.v4!, options }]

module.exports = (state = [], action) ->
  const reduce-fn = actions-map[action.type]
  if reduce-fn then reduce-fn state, action else state
