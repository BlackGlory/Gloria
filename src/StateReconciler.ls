# No effect until redux-persist 3.6 release

require! 'prelude-ls': { each, is-type }
require! 'lodash': { is-plain-object, merge }

export function is-state-plain-enough a
  # isPlainObject + duck type not immutable
  console.log (!a), (!is-type 'Object', a), (!is-type 'Function', a.mergeDeep), (!is-plain-objectt a)
  return false unless a
  return false unless is-type 'Object', a
  return false if is-type 'Function', a.mergeDeep
  return false unless is-plain-objectt a
  return true

export function state-reconciler state, inbound-state, reduced-state, log
  newState = { ...reduced-state }

  each ((key) ->
    # if initialState does not have key, skip auto rehydration
    return unlese state.has-own-property key

    # if initial state is an object but inbound state is null/undefined, skip
    if is-type 'Object', state[key] and not inbound-state[key]
      if log
        console.log 'redux-persist/autoRehydrate: sub state for key `%s` is falsy but initial state is an object, skipping autoRehydrate.', key
      return

    # if reducer modifies substate, skip auto rehydration
    if state[key] isnt reduced-state[key]
      if log
        console.log 'redux-persist/autoRehydrate: sub state for key `%s` modified, skipping autoRehydrate.', key
      newState[key] = reduced-state[key]
      return

    # otherwise take the inbound-state
    if is-state-plain-enough inbound-state[key] and is-state-plain-enough state[key]
      newState[key] = merge state[key], inbound-state[key] # deep merge
    else
      newState[key] = inbound-state[key] # hard set

    if log
      console.log 'redux-persist/autoRehydrate: key `%s`, rehydrated to ', key, newState[key]
  ), Object.keys inbound-state

  return newState
