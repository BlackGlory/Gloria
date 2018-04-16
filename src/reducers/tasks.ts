import { v4 as uuidV4 } from 'uuid'
import types from '../actions/types'
import { uniqueBy } from '../helpers';

const actionsMap = {
  [types.addTask]: (state: any[], { name, code, triggerInterval, needInteraction, triggerCount, pushCount, isEnable, origin }) => {
    return [...state, {
      id: uuidV4()
    , name
    , code
    , triggerInterval
    , needInteraction
    , triggerCount
    , pushCount
    , isEnable
    , origin
    }]
  }
, [types.updateTask]: (state: any[], { id, name, code }) => {
    return state.map(x => {
      if (x.id !== id) {
        return x
      }

      return {
        ...x
      , name
      , code
      }
    })
  }
, [types.updateTaskByOrigin]: (state: any[], { origin, code }) => {
    return state.map(x => {
      if (x.origin !== origin) {
        return x
      }

      return {
        ...x
      , code
      }
    })
  }
, [types.removeTask]: (state, { id }) => {
    return state.filter(x => x.id !== id)
  }
, [types.removeTaskByOrigin]: (state, { origin }) => {
    return state.filter(x => x.origin !== origin)
  }
, [types.setTriggerInterval]: (state, { id, triggerInterval }) => {
    return state.map(x => {
      if (x.id !== id) {
        return x
      }

      return {
        ...x
      , triggerInterval
      }
    })
  }
, [types.setNeedInteraction]: (state, { id, needInteraction }) => {
    return state.map(x => {
      if (x.id !== id) {
        return x
      }

      return {
        ...x
      , needInteraction
      }
    })
  }
, [types.setIsEnable]: (state, { id, isEnable }) => {
    return state.map(x => {
      if (x.id !== id) {
        return x
      }

      return {
        ...x
      , isEnable
      }
    })
  }
, [types.increaseTriggerCount]: (state, { id, date }) => {
    return state.map(x => {
      if (x.id !== id) {
        return x
      }

      return {
        ...x
      , triggerDate: date
      , triggerCount: x.triggerCount + 1
      }
    })
  }
, [types.increasePushCount]: (state, { id, date }) => {
    return state.map(x => {
      if (x.id !== id) {
        return x
      }

      return {
        ...x
      , pushDate: date
      , pushCount: x.pushCount + 1
      }
    })
  }
, [types.clearAllTasks]: () => []
, [types.mergeTasks]: (state, { newTasks }) => {
    return uniqueBy(x => x.id, [...state, ...newTasks].reverse()).reverse()
  }
, [types.removeOrigin]: (state, { id }) => {
    return state.map(x => {
      if (x.id !== id) {
        return x
      }
      const result = { ...x }
      delete result.origin
      return result
    })
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