'use strict'

require! 'vue': Vue
require! 'redux': { create-store, apply-middleware, compose }
require! 'revue': Revue
require! 'redux-persist': { persist-store, auto-rehydrate }
require! 'redux-persist/constants': { REHYDRATE, KEY_PREFIX }
require! 'redux-action-buffer': create-action-buffer
require! 'redux-logger': create-logger
require! 'lodash/lang/isEqual': is-equal
require! './reducers/index.ls': reducers

const logger = create-logger do
  duration: true
  action-transformer: (action) -> {
    ...action
    type: String action.type
  }

const redux-store = do ->
  const init-state =
    tasks: []
    notifications: []
    stages: []
    config: {}
  if process.env.NODE_ENV is 'production'
    create-store reducers, init-state, compose auto-rehydrate!, apply-middleware create-action-buffer REHYDRATE
  else
    create-store reducers, init-state, compose auto-rehydrate!, apply-middleware(create-action-buffer REHYDRATE), apply-middleware logger

function sync persistor, config = {}
  const blacklist = config.blacklist ? false
  const whitelist = config.whitelist ? false

  window.add-event-listener 'storage', ({ key, new-value }) ->
    if key and key.starts-with KEY_PREFIX
      const keyspace = key.substr KEY_PREFIX.length
      if whitelist and not whitelist.includes keyspace
        return
      if blacklist and blacklist.includes keyspace
        return
      persistor.rehydrate "#{keyspace}": JSON.parse new-value

sync persist-store redux-store, {}
const { store } = new Revue Vue, redux-store
module.exports = store
