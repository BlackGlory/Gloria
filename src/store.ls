'use strict'

require! 'vue': Vue
require! 'redux': { create-store }
require! 'revue': Revue
require! 'redux-persist': { persist-store, auto-rehydrate }
require! 'browser-redux-sync': { configure-sync, sync }
require! './reducers/index.ls': reducers

const redux-store = create-store reducers, { tasks: [], notifications: [], stages: [] }, auto-rehydrate!
persistor = persist-store redux-store, configure-sync!
sync persistor
const { store } = new Revue Vue, redux-store
module.exports = store
