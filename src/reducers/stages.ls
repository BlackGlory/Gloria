'use strict'

require! 'prelude-ls': { sort-by, reverse, take, map, lists-to-obj, obj-to-lists, last }
require! '../actions/types.ls': types

const actions-map =
  (types.commit-to-stage): (state, { id, next-stage }) ->
    if (state.find (x) -> x.id is id)
      state.map (x) ->
        return x if x.id isnt id
        stage-obj = lists-to-obj (map (.message), x.stage), x.stage
        for k, v of next-stage
          stage-obj[v.message] = {
            ...v
            unread: not stage-obj[v.message]
            updated-at: Date.now!
          }
        stage-arr = sort-by (.updated-at), last obj-to-lists stage-obj
        if stage-arr.length > 30
          stage-arr = take 30 reverse stage-arr
        {
          id
          stage: stage-arr
        }
    else
      [...state, {
        id
        stage: next-stage.map (x) ->
          {
            ...x
            unread: false
            updated-at: Date.now!
          }
      }]

  (types.clear-stage): (state, { id }) ->
    state.filter (x) -> x.id isnt id
  (types.clear-all-stages): -> []
  (types.mark-stage-read): (state, { id }) ->
    state.map (x) ->
      return x if x.id isnt id
      {
        id
        stage: x.stage.map (v) ->
          {
            ...v
            unread: false
            updated-at: Date.now!
          }
      }

module.exports = (state = [], action) ->
  const reduce-fn = actions-map[action.type]
  if reduce-fn then reduce-fn state, action else state
