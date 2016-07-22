'use strict'

require! '../actions/types.ls': types

const actions-map =
  (types.add-task): (state, { name, code, trigger-interval, can-notice-repeatedly }) ->
    [...state, {
      id: (state.reduce (max-id, x) -> (Math.max x.id, max-id), -1) + 1
      name
      code
      trigger-interval
      can-notice-repeatedly
    }]
  (types.edit-task): (state, { id, name, code }) ->
    state.map x ->
      return x if x.id isnt id
      {
        ...x
        name: name || x.name
        code: code || x.code
      }
  (types.remove-task): (state, { id }) ->
    state.filter x -> x.id isnt id
  (types.set-trigger-interval): (state, { id, trigger-interval }) ->
    state.map x ->
      return x if x.id isnt id
      {
        ...x
        trigger-interval
      }
  (types.set-can-notice-repeatly): (state, { id, can-notice-repeatedly }) ->
    state.map x ->
      return x if x.id isnt id
      {
        ...x
        can-notice-repeatedly
      }

module.exports = (state = [], action) ->
  const reduce-fn = actions-map[action.type]
  if reduce-fn then reduce-fn state, action else state
