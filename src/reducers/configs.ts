import types from '../actions/types'

const actionsMap = {
  [types.setConfig]: (state: any, { name, value }: { name: string, value: any }) => ({
    ...state
  , [name]: value
  })
, [types.clearAllConfigs]: () => ({})
, [types.mergeConfigs]: (state: any, options: { newConfigs: any[] } ) => ({
    ...state
  , ...options.newConfigs
  })
}

export default (state: any = {}, action: any) => {
  const reduceFn = actionsMap[action.type] as Function
  if (reduceFn) {
    return reduceFn(state, action)
  } else {
    return state
  }
}