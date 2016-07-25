'use strict'

require! 'prelude-ls': { sort-by, reverse, take, map }
require! '../actions/types.ls': types

const actions-map =
  (types.commit-to-stage): (state, { id, next-stage }) ->
    state.map (x) ->
      return x if x.id isnt id
      stage-obj = lists-to-obj (map (.message) x.stage), x.stage
      for v of next-stage
        stage[v.message] = {
          ...v
          unread: not stage[v.message]
          updated-at: Date.now!
        }
      stage-arr = sort-by (.updated-at) stage
      if stage-arr.length > 30
        stage-arr = take 30 reverse stage-arr
      {
        id
        stage: stage-arr
      }

  (types.clear-stage): (state, { id }) ->
    state.filter (x) -> x.id isnt id
  (types.clear-all-stagas): -> []
  (types.mark-stage-read): (state, { id }) ->
    state.map (x) ->
      return x if x.id isnt id
      {
        id
        stage: x.stage.map (v) -> { ...v, unread: false }
      }

module.exports = (state = [], action) ->
  const reduce-fn = actions-map[action.type]
  if reduce-fn then reduce-fn state, action else state
