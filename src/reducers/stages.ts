import * as MD5 from 'md5'
import types from '../actions/types'
import notifications from './notifications'
import { listsToObj, sortBy, uniqueBy } from '../helpers'

const LIMITED = 100 //times

function generateKey(notification: any) {
  return MD5(`${ notification.title }${ notification.message }${ notification.id }`)
}

const actionsMap = {
  [types.commitSingleToStage]: (state: any[], { id, nextStage }: { id: string, nextStage: any[] }) => {
    if (state.find(container => container.id === id)) {
      return state.map(container => {
        if (container.id !== id) {
          return container
        }

        if (generateKey(nextStage) === generateKey(container.stage)) {
          return {
            ...container
          , stage: {
              ...nextStage
            , unread: false
            }
          }
        } else {
          return {
            ...container
          , stage: {
              ...nextStage
            , unread: true
            }
          }
        }
      })
    } else {
      return [...state, {
        id
      , stage: {
          ...nextStage
        , unread: false
        }
      }]
    }
  }
, [types.commitToStage]: (state: any[], { id, nextStage }: { id: string, nextStage: any[] }) => {
    if (state.find(container => container.id === id)) {
      return state.map(container => {
        if (container.id !== id) {
          return container
        }

        const oldStage = container.stage.map((notification: any, i: number) => ({
          ...notification
        , order: i
        }))

        const stageObjByHash = listsToObj(oldStage.map(generateKey), oldStage)

        let nextOrder = -oldStage.length
        const newStage = []
        for (const notification of nextStage) {
          const hash = generateKey(notification)

          if (stageObjByHash[hash]) {
            stageObjByHash[hash] = {
              ...stageObjByHash[hash]
            , ...notification
            , unread: false
            , order: nextOrder
            }
            nextOrder += 1
          } else {
            newStage.push({
              ...notification
            , unread: true
            })
          }
        }

        let stageArr = [...newStage, ...sortBy((x: any) => x.order, Object.values(stageObjByHash))]
        stageArr.forEach(notification => delete notification.order)

        if (stageArr.length > LIMITED) {
          stageArr = stageArr.slice(0, LIMITED)
        }

        return {
          id
        , stage: stageArr
        }
      })
    } else {
      if (nextStage.length > LIMITED) {
        nextStage = nextStage.slice(0, LIMITED)
      }

      const stage = nextStage.map(notification => ({
        ...notification
      , unread: false
      }))

      return [...state, {
        id
      , stage
      }]
    }
  }
, [types.clearStage]: (state: any[], { id }: { id: string }) => {
    return state.filter(container => container.id !== id)
  }
, [types.clearAllStages]: () => []
, [types.markStageRead]: (state: any[], { id }: { id: string }) => {
    return state.map(x => {
      if (x.id !== id) {
        return x
      }

      if (Array.isArray(x.stage)) {
        return {
          id
        , stage: x.stage.map((notification: any) => ({
            ...notification
          , unread: false
          }))
        }
      } else {
        return {
          id
        , stage: {
            ...x.stage
          , unread: false
          }
        }
      }
    })
  }
, [types.mergeStages]: (state: any[], { newStages }: { newStages: any[] }) => {
    return uniqueBy(x => x.id, [...state, ...newStages].reverse()).reverse()
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