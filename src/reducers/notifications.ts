import { v4 as uuidV4 } from 'uuid'
import types from '../actions/types'
import { uniqueBy } from '../helpers'

const LIMITED = 200 // times

const actionsMap = {
  [types.addNotification]: (state: any[], { options }: { options: any }) => {
    let result = [{ id: uuidV4(), options }, ...state]
    if (result.length > LIMITED) {
      result = result.slice(0, LIMITED)
    }
    return result
  }
, [types.clearAllNotifications]: () => []
, [types.mergeNotifications]: (state: any[], { newNotifications }: { newNotifications: any[] }) => {
    return uniqueBy(x => x.id, [...state, ...newNotifications].reverse()).reverse()
  }
}

export default (state: any[] = [], action: any) => {
  const reduceFn = actionsMap[action.type] as Function
  if (reduceFn) {
    return reduceFn(state, action)
  } else {
    return state
  }
}