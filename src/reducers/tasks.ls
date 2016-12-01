'use strict'

require! 'prelude-ls': { unique-by, reverse, map, filter }
require! 'uuid/v4': uuid-v4
require! '../actions/types.ls': types

const actions-map =
  (types.add-task): (state, { name, code, trigger-interval, need-interaction, trigger-count, push-count, is-enable, origin }) ->
    [...state, {
      id: uuid-v4!
      name
      code
      trigger-interval
      need-interaction
      trigger-count
      push-count
      is-enable
      origin
    }]

  (types.update-task): (state, { id, name, code }) ->
    map ((x) ->
      return x if x.id isnt id
      {
        ...x
        name
        code
      }
    ), state

  (types.update-task-by-origin): (state, { origin, code }) ->
    map ((x) ->
      return x if x.origin isnt origin
      {
        ...x
        code
      }
    ), state

  (types.remove-task): (state, { id }) ->
    filter ((x) -> x.id isnt id), state

  (types.remove-task-by-origin): (state, { origin }) ->
    filter ((x) -> x.origin isnt origin), state

  (types.set-trigger-interval): (state, { id, trigger-interval }) ->
    map ((x) ->
      return x if x.id isnt id
      {
        ...x
        trigger-interval
      }
    ), state

  (types.set-need-interaction): (state, { id, need-interaction }) ->
    map ((x) ->
      return x if x.id isnt id
      {
        ...x
        need-interaction
      }
    ), state

  (types.set-is-enable): (state, { id, is-enable }) ->
    map ((x) ->
      return x if x.id isnt id
      {
        ...x
        is-enable
      }
    ), state

  (types.increase-trigger-count): (state, { id, date }) ->
    map ((x) ->
      return x if x.id isnt id
      {
        ...x
        trigger-date: date
        trigger-count: x.trigger-count + 1
      }
    ), state

  (types.increase-push-count): (state, { id, date }) ->
    map ((x) ->
      return x if x.id isnt id
      {
        ...x
        push-date: date
        push-count: x.push-count + 1
      }
    ), state

  (types.clear-all-tasks): -> []

  (types.merge-tasks): (state, { new-tasks }) ->
    new-state = reverse [...state, ...new-tasks]
    new-state = unique-by (.id), new-state
    new-state = reverse new-state
    new-state

  (types.remove-origin): (state, { id }) ->
    map ((x) ->
      return x if x.id isnt id
      result = { ...x }
      delete result.origin
      result
    ), state

module.exports = (state = [], action) ->
  const reduce-fn = actions-map[action.type]
  if reduce-fn then reduce-fn state, action else state
