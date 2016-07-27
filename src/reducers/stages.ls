'use strict'

require! 'prelude-ls': { sort-by, reverse, take, map, lists-to-obj, obj-to-lists, last }
require! 'jshashes': { MD5 }
require! '../actions/types.ls': types

const LIMITED = 100

const actions-map =
  (types.commit-to-stage): (state, { id, next-stage }) ->
    if state.find ((x) -> x.id is id)
      state.map (x) ->
        return x if x.id isnt id

        generate-key = (x) -> new MD5!.hex x.title + x.message
        stage-obj = lists-to-obj (map generate-key, x.stage), x.stage

        for k, v of next-stage
          key = generate-key v

          if stage-obj[key]
            stage-obj[key] = {
              ...stage-obj[key]
              ...v
              unread: false
            }
          else
            stage-obj[key] = {
              ...stage-obj[key]
              ...v
              unread: true
              created-at: Date.now!
            }

        stage-arr = sort-by (.created-at), last obj-to-lists stage-obj

        if stage-arr.length > LIMITED
          stage-arr = take LIMITED, reverse stage-arr

        {
          id
          stage: stage-arr
        }
    else
      if next-stage.length > LIMITED
        next-stage = take LIMITED, reverse next-stage

      [...state, {
        id
        stage: next-stage.map (x) ->
          {
            ...x
            unread: false
            created-at: Date.now!
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
          }
      }

module.exports = (state = [], action) ->
  const reduce-fn = actions-map[action.type]
  if reduce-fn then reduce-fn state, action else state
