'use strict'

require! 'redux': { combineReducers }
require! './tasks.ls': tasks
require! './notifications.ls': notifications
require! './stages.ls': stages
require! './configs.ls': config

module.exports = combineReducers { tasks, notifications, stages, config }
