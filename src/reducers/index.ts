import { combineReducers } from 'redux'
import tasks from './tasks'
import notifications from './notifications'
import stages from './stages'
import configs from './configs'

export default combineReducers({
  tasks
, notifications
, stages
, configs
})