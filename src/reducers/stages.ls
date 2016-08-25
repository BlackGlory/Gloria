'use strict'

require! 'prelude-ls': { sort-by, take, map, lists-to-obj, obj-to-lists, last, each, filter, find }
require! 'jshashes': { MD5 }
require! '../actions/types.ls': types

const LIMITED = 100

const actions-map =
  (types.commit-to-stage): (state, { id, next-stage }) ->
    function generate-key x
      new MD5!.hex "#{x.title}#{x.message}"

    if find ((x) -> x.id is id), state
      return map ((x) ->
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

        stage-arr = [...new-stage, ...sort-by (.order), last obj-to-lists stage-obj]
        each ((v) -> delete v.order), stage-arr

        if stage-arr.length > LIMITED
          stage-arr = take LIMITED, stage-arr

        return {
          id
          stage: stage-arr
        }
      ), state
    else
      if next-stage.length > LIMITED
        next-stage = take LIMITED, next-stage

      stage = map ((x) ->
        {
          ...x
          unread: false
        }
      ), next-stage

      return [...state, {
        id
        stage
      }]

  (types.clear-stage): (state, { id }) ->
    filter ((x) -> x.id isnt id), state

  (types.clear-all-stages): -> []

  (types.mark-stage-read): (state, { id }) ->
    map ((x) ->
      return x if x.id isnt id

      {
        id
        stage: x.stage.map (v) ->
          {
            ...v
            unread: false
          }
      }
    ), state

module.exports = (state = [], action) ->
  const reduce-fn = actions-map[action.type]
  if reduce-fn then reduce-fn state, action else state
