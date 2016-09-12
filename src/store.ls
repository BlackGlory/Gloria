'use strict'

require! 'vue': Vue
require! 'redux': { create-store, apply-middleware, compose }
require! 'revue': Revue
require! 'redux-persist': { persist-store, auto-rehydrate }
require! 'redux-persist/constants': { REHYDRATE }
require! 'redux-action-buffer': create-action-buffer
require! 'redux-logger': create-logger
require! 'redux-persist-crosstab': crosstab-sync
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

crosstab-sync persist-store redux-store, {}
const { store } = new Revue Vue, redux-store
module.exports = store
