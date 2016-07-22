'use strict'

require! 'redux': { combineReducers }
require! './tasks.ls': tasks

module.exports = combineReducers { tasks }
