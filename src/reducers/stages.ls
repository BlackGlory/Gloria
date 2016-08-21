'use strict'

require! 'prelude-ls': { sort-by, take, map, lists-to-obj, obj-to-lists, last }
require! 'jshashes': { MD5 }
require! '../actions/types.ls': types

const LIMITED = 100

const actions-map =
  (types.commit-to-stage): (state, { id, next-stage }) ->
    function generate-key x
      new MD5!.hex "#{x.title}#{x.message}"

    if state.find ((x) -> x.id is id)
      state.map (x) ->
        return x if x.id isnt id

        old-stage = x.stage.map (v, i) ->
          {
            ...v
            order: i
          }

        stage-obj = lists-to-obj (map generate-key, old-stage), old-stage

        next-order = -old-stage.length
        new-stage = []
        for k, v of next-stage
          key = generate-key v

          if stage-obj[key]
            stage-obj[key] = {
              ...stage-obj[key]
              ...v
              unread: false
              order: next-order
            }
            next-order += 1
          else
            new-stage.push {
              ...v
              unread: true
            }

        console.log new-stage, next-stage, old-stage, stage-obj

        stage-arr = [...new-stage, ...sort-by (.order), last obj-to-lists stage-obj]
        stage-arr.for-each (v) -> delete v.order

        if stage-arr.length > LIMITED
          stage-arr = take LIMITED, stage-arr

        {
          id
          stage: stage-arr
        }
    else
      if next-stage.length > LIMITED
        next-stage = take LIMITED, next-stage

      [...state, {
        id
        stage: next-stage.map (x) ->
          {
            ...x
            unread: false
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
