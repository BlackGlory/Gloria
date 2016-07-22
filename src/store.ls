'use strict'

require! 'vue': Vue
require! 'redux': { create-store }
require! 'revue': Revue
require! 'redux-persist': { persist-store, auto-rehydrate }
require! 'localForage': local-forage
require! './reducers/index.ls': reducers

const redux-store = create-store reducers, undefined, auto-rehydrate!
persist-store redux-store, { storage: local-forage }
const store = new Revue Vue, redux-store
module.exports = store
