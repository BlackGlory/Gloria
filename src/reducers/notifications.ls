'use strict'

require! 'node-uuid': uuid
require! '../actions/types.ls': types

const LIMITED = 100items

const actions-map =
  (types.add-notification): (state, { options }) ->
    result = [{ id: uuid.v4!, options }, ...state]
    if result.length > LIMITED
      result = result[0 til LIMITED]
    result

  (types.clear-all-notifications): -> []

module.exports = (state = [], action) ->
  const reduce-fn = actions-map[action.type]
  if reduce-fn then reduce-fn state, action else state
