'use strict'

require! 'redux': { combineReducers }
require! './tasks.ls': tasks
require! './notifications.ls': notifications

module.exports = combineReducers { tasks, notifications }
