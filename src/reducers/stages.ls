'use strict'

require! 'prelude-ls': { unique-by, reverse, sort-by, take, map, lists-to-obj, obj-to-lists, last, each, filter, find }
require! 'jshashes': { MD5 }
require! '../actions/types.ls': types

const LIMITED = 100items

function generate-key notification
  new MD5!.hex "#{notification.title}#{notification.message}#{notification.id}"

const actions-map =
  (types.commit-to-stage): (state, { id, next-stage }) ->
    if find ((container) -> container.id is id), state
      return map ((container) ->
        return container if container.id isnt id

        old-stage = container.stage.map (notification, i) ->
          {
            ...notification
            order: i
          }

        stage-obj-by-hash = lists-to-obj (map generate-key, old-stage), old-stage

        next-order = -old-stage.length
        new-stage = []
        for _, notification of next-stage
          hash = generate-key notification

          if stage-obj-by-hash[hash]
            stage-obj-by-hash[hash] = {
              ...stage-obj-by-hash[hash]
              ...notification
              unread: false
              order: next-order
            }
            next-order += 1
          else
            new-stage.push {
              ...notification
              unread: true
            }

        stage-arr = [...new-stage, ...sort-by (.order), last obj-to-lists stage-obj-by-hash]
        each ((notification) -> delete notification.order), stage-arr

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

      stage = map ((notification) ->
        {
          ...notification
          unread: false
        }
      ), next-stage

      return [...state, {
        id
        stage
      }]

  (types.clear-stage): (state, { id }) ->
    filter ((container) -> container.id isnt id), state

  (types.clear-all-stages): -> []

  (types.mark-stage-read): (state, { id }) ->
    map ((x) ->
      return x if x.id isnt id

      {
        id
        stage: x.stage.map (notification) ->
          {
            ...notification
            unread: false
          }
      }
    ), state

  (types.merge-stages): (state, { new-stages }) ->
    new-state = reverse [...state, ...new-stages]
    new-state = unique-by (.id), new-state
    new-state = reverse new-state
    new-state

module.exports = (state = [], action) ->
  const reduce-fn = actions-map[action.type]
  if reduce-fn then reduce-fn state, action else state
